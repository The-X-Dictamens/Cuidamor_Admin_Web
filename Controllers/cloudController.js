const {Storage} = require('@google-cloud/storage');

let projectId = 'x-dictamens';
let keyFilename = './env/credentials.json';
let storage = new Storage({projectId, keyFilename});

const bucket = storage.bucket('xdictamenscuidamor');

exports.upload = async function subirArchivo(file, name){
    return new Promise((resolve, reject) => {
        let blob = bucket.file(name);
        let blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on('error', (err) => {
            reject(err);
        });
        blobStream.on('finish', () => {
            resolve();
        });
        blobStream.end(file.buffer);
    });
} 



exports.getStream = async function obtenerFlujo(name){
    try{
        const [file] = await bucket.file(name).createReadStream();
        return file;
    }catch(err){
        throw err;
    }
}



exports.delete = async function borrarArchivo(name){
    return new Promise((resolve, reject) => {
        let blob = bucket.file(name);
        blob.delete().then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}




exports.getUrl = async function obtenerEnlacePublico(name) {
    try {
      // Generar un enlace de acceso público al archivo
      const [url] = await bucket.file(name).getSignedUrl({
        action: 'read',
        expires: Date.now() + 30 * 60 * 1000, // Caducidad del enlace (en este caso, 30 minutos)
      });
  
      //console.log('Enlace de acceso público al archivo:', url);
      return url;
    } catch (error) {
      console.error('Error al obtener el enlace de acceso público:', error);
      return null;
    }
}



exports.update = async function actualizarArchivo(file, name) {
    try {
      // Subir el nuevo archivo al bucket de Google Cloud Storage
      await bucket.file(name).save(file.buffer);
      console.log('Archivo actualizado correctamente.');
      return true;
    } catch (error) {
      console.error('Error al actualizar el archivo:', error);
      return false;
    }
}
