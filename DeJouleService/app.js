const PROTO_PATH = __dirname + '/grpc.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const dejoule_proto = grpc.loadPackageDefinition(packageDefinition).dejoule;
function safeToDelete(call, callback) {
  console.log(call);
  let randomValue = getRandomBoolean();
  callback(null, {isSafe: randomValue});
}
function main() {
  const server = new grpc.Server();
  server.addService(dejoule_proto.DejouleSite.service, {safeToDelete: safeToDelete});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('grpc server started at 50051')
}

function getRandomBoolean(){
  return Math.random() >= 0.5;
}
main();