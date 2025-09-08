import multer from "multer";

// Store file in memory
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;