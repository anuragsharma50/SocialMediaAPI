import multer from "multer";

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"uploads");
    },
    filename: (req,file,cb) => {
        const fileName = file.fieldname + Date.now();
        cb(null, fileName)
    }
});

export const upload = multer({ storage: storage });
