var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedin == true && req.session.role === 'yes'){    
         res.render('admin/index', { title: 'DashBoard', my_session : req.session });
    }else {
        req.flash('error', ('error'))
        res.redirect('/login')
    }
});

router.get('/view_employee', (req, res) => {
    
    let sql = 'SELECT * FROM pet_store.admin'
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('admin/admin_info/admin_view',
                {
                    title: 'Employees List',
                    employees: '',
                    my_session : req.session
                })
            }else {
                res.render('admin/admin_info/admin_view',
                {
                    title: 'Employees List',
                    employees: results,
                    my_session : req.session
                })
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Get Add Admin
router.get('/add_employee', (req, res) => {
    if (req.session.loggedin == true && req.session.role === 'yes') {
        res.render('admin/admin_info/add_admin', {
            title: 'Add Employee',
            my_session : req.session
        });
    }else {
        res.redirect('/login')
    }
});

// Add Employee
router.post('/add_employ', (req, res) => {
    let sql = "INSERT INTO pet_store.admin SET ?";
    let data = {
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        password : req.body.password 
    };
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('err', 'Error, Try Again');
                res.redirect('/admin/add_employee');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/admin/add_employee');
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Delete Employee
router.get('/delete/:id', (req, res) => {
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query('DELETE FROM pet_store.admin WHERE id=' + req.params.id, (err, results) => {
            if (err) {
                req.flash('error', 'Could Not Delete')
                res.redirect('/admin/view_employee')
            }else {
                req.flash('success', 'Employee Deleted')
                res.redirect('/admin/view_employee')
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Get Admin Edit
router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query('SELECT * FROM pet_store.admin WHERE Id='+ req.params.id, function(err, results)     {
            if(err){
                req.flash('error', err); 
                res.render('admin/admin_info/edit_admin',
                {
                    title: "Employee Edit"
                });   
            }else {
                req.flash('success')
                res.render('admin/admin_info/edit_admin',
                {
                    title: "Employee Edit",
                    employees: results[0],
                    my_session : req.session
                });
            }               
        });
    }else {
        res.redirect('/login')
    }
});

// Get Admin Update
router.post('/update', (req, res) => {
    let data = {
        id : req.body.id,
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        password : req.body.password 
    };
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query('UPDATE pet_store.admin SET ? WHERE id =' + req.body.id, data, (err, results) => {
            if (err) {
                req.flash('err', 'Could Not Update');
                res.redirect('/admin/view_employee');
            }else {
                req.flash('success', 'Employee Updated');
                res.redirect('/admin/view_employee');
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Get Sales
router.get('/view_sales', (req, res) => {
    
    let sql = 'SELECT cs.*, pt.product_name, cust.fName, cust.lName FROM pet_store.product pt, pet_store.customer cust, pet_store.customer_sale cs WHERE cs.customer_id = cust.id AND cs.product_id = pt.id ORDER BY id'
    if (req.session.loggedin == true && req.session.role === 'yes') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('admin/sales',
                {
                    title: 'Sales List',
                    sales: '',
                    my_session : req.session
                })
            }else {
                res.render('admin/sales',
                {
                    title: 'sales List',
                    sales: results,
                    my_session : req.session
                })
            }
        });
    }else {
        res.redirect('/login')
    }
});

module.exports = router;