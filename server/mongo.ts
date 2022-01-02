import * as mongoose from 'mongoose';

const setMongo = async (): Promise<any> => {
  let mongodbURI: any;
  if (process.env.NODE_ENV !== 'test') {
    mongodbURI = process.env.MONGODB_URI;
  }
  await mongoose.connect(mongodbURI, {
    serverSelectionTimeoutMS: 5000
  }).catch(err => console.log(err.reason));
  console.log('Connected to MongoDB');
};

export default setMongo;
