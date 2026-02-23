import { extname } from "path";
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs"
import { uuid } from 'uuidv4';

export function checkExentions(value) {
  const ingoreExtentions = [
    'adp', 'app', 'asp', 'bas', 'bat', 'cer', 'chm', 'cmd', 'cnt', 'com', 'cpl', 'crt', 'csh', 'der', 'exe',
    'fxp', 'gadget', 'hlp', 'hpj', 'hta', 'inf', 'ins', 'isp', 'its', 'js', 'jse', 'ksh', 'lnk', 'mad', 'maf',
    'mag', 'mam', 'maq', 'mar', 'mas', 'mat', 'mau', 'mav', 'maw', 'mda', 'mdb', 'mde', 'mdt', 'mdw', 'mdz',
    'msc', 'msh', 'msh1', 'msh2', 'mshxml', 'msh1xml', 'msh2xml', 'msi', 'msp', 'mst', 'ops', 'osd', 'pcd',
    'pif', 'plg', 'prf', 'prg', 'pst', 'reg', 'scf', 'scr', 'sct', 'shb', 'shs', 'ps1', 'ps1xml', 'ps2', 
    'ps2xml', 'psc1', 'psc2', 'tmp', 'url', 'vb', 'vbe', 'vbp', 'vbs', 'vsmacros', 'vsw', 'ws', 'wsc', 'wsf',
    'wsh', 'xnk', 'ade', 'cla', 'class', 'grp', 'jar', 'mcf', 'ocx', 'pl', 'xbap'
  ]
  return !ingoreExtentions.includes(value)
}

export const Upload = {
  fileFilter: (req: any, files: any, callback) => {
    const ext = extname(files.originalname).replace('.', '')
    const checkExtention = checkExentions(ext)
    if (!checkExtention) {
      return callback(new HttpException('Файлын төрөл зөвшөөрөгдөөгүй байна !', HttpStatus.NOT_FOUND), '')
    }
    return callback(null, true)
  },
  storage: diskStorage({
    async destination(req: any, file: any, callback) {
      let path = process.env.FILE_PATH || './upload_files'
      if (!existsSync(path)) {
        mkdirSync(path);
      }
      callback(null, path);
    },
    filename(req, file, callback) {
      let fileExt = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase()
      const filename = uuid().replace(/-/g, '') + fileExt;
      callback(null, filename)
    },
  })
}