const router = require('express').Router();
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.MONGODB_URL;
const dbName = 'api'

router.post('/tamu', function (req, res) {
  var errorMessage = {
    name: ['nama harus disi', 'nama sudah terdaftar']
  }
  const client = new mongo(url, { useNewUrlParser: true, useUnifiedTopology: true });
  const { name, address, phone, status } = req.body

  if (!name) {
    client.close();
    res.status(400).send({ messagge: errorMessage.name[0] })
  } else {
    client.connect(function (err) {
      assert.equal(null, err);
      const db = client.db(dbName);
      db.collection('tamu_undangan').findOne({ name: name }, { name: '$name' }, (err, resp) => {
        assert.equal(null, err);
        if (!resp) {
          db.collection('tamu_undangan').insert({ name, address: address || '', phone: phone || '', status: status || 0 }, (err, resp) => {
            assert.equal(null, err);
            if (resp) {
              client.close();
              res.status(200).send({ messagge: 'add success' })
            }
          })
        } else {
          client.close();
          res.status(400).send({ messagge: errorMessage.name[1] })
        }
      })
    });
  }
})

router.put('/tamu', function (req, res) {
  var errorMessage = {
    name: ['harap masukan nama', ' nama tidak dapat di temukan'],
    status: ['harap masukan status', 'status cuma 0 dan 1', 'status sama dengan sebelumnya'],
  }
  const client = new mongo(url, { useNewUrlParser: true, useUnifiedTopology: true });
  const { name, status } = req.body

  if (!name) {
    client.close();
    res.status(400).send({ messagge: errorMessage.name[0] })
  } else if (status === "") {
    client.close();
    res.status(400).send({ messagge: errorMessage.status[0] })
  }
  else {
    if (status == 1 || status == 0) {
      client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('tamu_undangan').findOne({ name: name }, (err, resp) => {
          assert.equal(null, err);
          if (!resp) {
            client.close();
            res.status(400).send({ messagge: errorMessage.name[1] })
          } else if (resp.status == status) {
            client.close();
            res.status(400).send({ messagge: errorMessage.status[2] })
          } else {
            db.collection('tamu_undangan').updateOne({ name, status }, { '$set': { status } }, (err, resp) => {
              assert.equal(null, err);
              if (resp) {
                client.close();
                res.status(200).send({ messagge: 'edit success' })
              }
            })


          }
        })
      });
    } else {
      client.close();
      res.status(400).send({ messagge: errorMessage.status[1] })

    }

  }
})

router.delete('/tamu', function (req, res) {
  var errorMessage = {
    name: ['harap masukan nama', ' nama tidak dapat di temukan'],
    status: ['tidak bisa dihapus apabila status 1']
  }
  const client = new mongo(url, { useNewUrlParser: true, useUnifiedTopology: true });
  const { name, status } = req.body

  if (!name) {
    client.close();
    res.status(400).send({ messagge: errorMessage.name[0] })
  } else {
    client.connect(function (err) {
      assert.equal(null, err);
      const db = client.db(dbName);
      db.collection('tamu_undangan').findOne({ name: name }, (err, resp) => {
        assert.equal(null, err);
        console.log(resp)
        if (!resp) {
          client.close();
          res.status(400).send({ messagge: errorMessage.name[1] })
        } else if (resp.status == 1) {
          client.close();
          res.status(400).send({ messagge: errorMessage.status[0] })
        } else {
          db.collection('tamu_undangan').deleteOne({ name }, (err, resp) => {
            assert.equal(null, err);
            if (resp) {
              client.close();
              res.status(200).send({ messagge: 'delete success' })
            }
          })


        }
      })
    });
  }
})

router.get('/tamu', function (req, res) {

  const client = new mongo(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(function (err) {
    assert.equal(null, err);
    const db = client.db(dbName);
    db.collection('tamu_undangan').find({}).toArray((err, resp) => {
      assert.equal(null, err);
      client.close()
      res.status(200).send(resp)
    })
  });

})

module.exports = router;