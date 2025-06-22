// import { Storage } from '@google-cloud/storage';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const projectId = 'xenon-axe-450704-n3';
// const keyFilename = path.join(__dirname, './xenon-axe-450704-n3-b08c27baaa39.json'); 
// const bucketName = 'simpan_buku_tukar'; 
// const storage = new Storage({
//   projectId,
//   keyFilename,
// });

// const bucket = storage.bucket(bucketName);

// export { storage, bucket };








import { Storage } from '@google-cloud/storage';

// Ambil projectId dan bucketName dari environment variables (praktik terbaik untuk GCP)
// Jika GCLOUD_PROJECT atau GCS_BUCKET_NAME tidak disetel di env GCP,
// kode akan menggunakan nilai setelah '||' sebagai fallback.
// Namun, sangat direkomendasikan untuk MENYETELNYA di environment GCP Anda.
const projectId = process.env.GCLOUD_PROJECT || 'e-13-450704';
const bucketName = process.env.GCS_BUCKET_NAME || 'simpan-buku-tukar';

// Inisialisasi Storage tanpa keyFilename.
// Kredensial akan diambil secara otomatis dari environment GCP.
const storage = new Storage({
  projectId, // Anda bisa tetap menyertakan projectId secara eksplisit, atau menghapusnya jika GCLOUD_PROJECT sudah pasti ter-set.
});

const bucket = storage.bucket(bucketName);

export { storage, bucket };
