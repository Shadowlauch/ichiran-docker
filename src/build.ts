import {execSync} from 'child_process';
import {access} from 'fs/promises';

const config = {
  dumpPath: process.env.DUMP_PATH ?? 'https://github.com/tshatrov/ichiran/releases/download/ichiran-170521/ichiran-170521.pgdump',
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'postgres',
    port: process.env.POSTGRES_PORT ?? '5432',
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? '',
    db: process.env.POSTGRES_DB ?? 'ichiran',
  }
};

const fileExits = async (file: string) => {
  try {
    await access(file);
  } catch (e) {
    return false;
  }
  return true;
};

export const build = async () => {
    if (await fileExits('/root/quicklisp/local-projects/ichiran/ichiran-cli')) {
      console.log('Build skipped');
      return;
    }

    console.log('Start build');
    execSync(`wget ${config.dumpPath}`);
    const dumpFilename = config.dumpPath.split('/').pop();

    if (!dumpFilename) throw Error('Dump path does not contain file');

    try {
      execSync(`export PGPASSWORD='${config.postgres.password}' && dropdb -h ${config.postgres.host} -p ${config.postgres.port} -U ${config.postgres.user} -w ${config.postgres.db}`);
    } catch (e) {
    }

    console.log('Start creating db. This will take a while');
    try {
      execSync(`export PGPASSWORD='${config.postgres.password}' && createdb -h ${config.postgres.host} -p ${config.postgres.port} -U ${config.postgres.user} -w -E 'UTF8' -l 'ja_JP.utf8' -T template0 ${config.postgres.db}`);
    } catch (e) {
    }

    try {
      execSync(`export PGPASSWORD='${config.postgres.password}' && pg_restore -d ${config.postgres.db} -h ${config.postgres.host} -p ${config.postgres.port} -U ${config.postgres.user} -w ${dumpFilename}`);
    } catch (e) {
    }

    execSync(`rm ${dumpFilename}`);

    console.log('clone ichiran');
    const quicklispDir = '~/quicklisp/local-projects/';
    const ichiranDir = quicklispDir + 'ichiran/';
    const jmdictDataDir = quicklispDir + 'jmdict-data/';
    execSync(`rm -rf ${ichiranDir}`);
    execSync(`cd ${quicklispDir} && git clone https://github.com/tshatrov/ichiran.git`);

    console.log('clone jmdict data');
    execSync(`cd ${quicklispDir} && git clone https://gitlab.com/yamagoya/jmdictdb.git`);

    execSync(`rm -rf ${jmdictDataDir}`);
    execSync(`cp -r ${quicklispDir}jmdictdb/jmdictdb/data ${jmdictDataDir}`);
    execSync(`rm -rf ${quicklispDir}jmdictdb`);

    console.log('Create settings file');
    execSync(`cat <<EOT >> ${ichiranDir}settings.lisp
  (in-package #:ichiran/conn)

(defparameter *connection* '("${config.postgres.db}" "${config.postgres.user}" "${config.postgres.password}" "${config.postgres.host}"))

(defparameter *connections* '((:old "jmdict_old" "postgres" "password" "localhost")
                              (:test "jmdict_test" "postgres" "password" "localhost")))

(in-package #:ichiran/dict)

(defparameter *jmdict-path* #p"/home/you/dump/JMdict_e")

(defparameter *jmdict-data* #p"${jmdictDataDir}")

(in-package #:ichiran/kanji)

(defparameter *kanjidic-path* #P"/home/you/dump/kanjidic2.xml")
EOT`);

    console.log('Running sbcl');

    execSync('sbcl --non-interactive --eval "(ql:quickload :ichiran)" --eval "(ichiran/mnt:add-errata)" --eval "(ichiran/test:run-all-tests)"');
    execSync('sbcl --non-interactive --eval "(ql:quickload :ichiran/cli)" --eval "(ichiran/cli:build)"');

    console.log('Build complete');
};


