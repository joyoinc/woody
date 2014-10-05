var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dehrl9peq',
  api_key: '958516719534222',
  api_secret: 'SmsB1_RoiKYV7YVrS_GkyQTQB38'
});

cloudinary.uploader.upload('/home/xhx/a.png', function(result){
  console.log(result);
});
