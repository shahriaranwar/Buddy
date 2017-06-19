var q = 'clientstatus';
 
function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher 
function publisher(conn) {
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer('something to do'));
  }
}
 
// Consumer 
function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  }
}
 
require('amqplib/callback_api')
  .connect('amqp://admin:admin@localhost:5672', function(err, conn) {
    if (err != null) bail(err);
    consumer(conn);
    //publisher(conn);
  });