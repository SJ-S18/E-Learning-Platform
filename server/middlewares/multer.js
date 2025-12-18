import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, "uploads")
    },
    filename(req, file, cb){
const id = uuidv4()

const extName = file.originalname.split(".").pop();

const filename = `${id}.${extName}`;

cb(null, filename)
    }
});

export const uploadFiles = multer({storage}).single("file");