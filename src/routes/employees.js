const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database.js');

// GET all Employees
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// GET An Employee
router.get('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM employee WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// DELETE An Employee
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM employee WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({ status: 'Employee Deleted' });
    } else {
      console.log(err);
    }
  });
});

// INSERT An Employee
router.post('/', (req, res) => {
  // let { id, name, salary } = req.body;
  const { name, salary } = req.body;
  let id = null;

  // const query = `
  //   SET @id = ?;
  //   SET @name = ?;
  //   SET @salary = ?;
  //   CALL employeeAddOrEdit(@id, @name, @salary);
  // `;

  // if (id == undefined) { id = null };
  // console.log(id, name, salary);

  // mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
  mysqlConnection.query("CALL employeeAddOrEdit (?, ?, ?)", [id, name, salary], (err, rows) => {
    // console.log(err);
    if (!err) {
      // console.log(rows);
      // console.log(rows[0][0].id);
      id = rows[0][0].id;
      res.json({ status: `Employeed Saved with id = ${id}` });
    } else {
      console.log(err);
    }
  });

});


// Middleware Validation
const validateBody = (req, res, next) => {
  let name = req.body.name;

  if (name === undefined || name === null || name.length === 0) {
    return res.status(500).send({
      error: "El campo Nombre es requerido"
    });
  }
  // if string value is longer than 0, continue with next function in route
  next();
}

// router.put('/:id', (req, res) => {
router.put('/', validateBody, (req, res) => {
  const { id, name, salary } = req.body;
  // const { id } = req.params;

  console.log(name);

  const query = `
    SET @id = ?;
    SET @name = ?;
    SET @salary = ?;
    CALL employeeAddOrEdit(@id, @name, @salary);
  `;

  // mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
  mysqlConnection.query("CALL employeeAddOrEdit (?, ?, ?)", [id, name, salary], (err, rows) => {
    if (!err) {

      // id = rows[0][0].id;
      if (rows[0][0].id != 0) {
        res.json({ status: 'Employee Updated' });
      } else {
        res.json({ status: 'Nothing Updated' });
      }
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
