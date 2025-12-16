const oracledb = require('oracledb');

export const OracleProvider = {
  provide: 'ORACLE_CLIENT',
  useFactory: () => {
    if (process.platform === 'win32') {
      oracledb.initOracleClient({
        libDir: 'D:\\oracle\\instantclient_19_25',
      });
    }

    if (process.platform === 'darwin') {
      oracledb.initOracleClient({
        libDir: process.env.ORACLE_PATH,
      });
    }

    return oracledb;
  },
};
