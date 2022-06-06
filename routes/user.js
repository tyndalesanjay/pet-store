var express = require('express');
var router = express.Router();
var conn = require('../lib/db');

// Get Products
router.get('/view_item', (req, res) => {
    let sql = 'SELECT * FROM pet_store.product'
    // if (req.session.loggedin == true) {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('user/view_items',
                {
                    title: 'Products',
                    items: ''
                })
            }else {
                res.render('user/view_items',
                {
                    title: 'Products',
                    items: results,
                    my_session : req.session
                })
            }
        });
    // }else {
    //     res.redirect('/login/user_login')
    // }
});

// Get Add user
router.get('/user_sign_up', (req, res) => {
        res.render('user/add_user', 
        {
            title: 'Sign Up',
            my_session : req.session
        })
});

// Add user
router.post('/add_customer', (req, res) => {
    let sql = "INSERT INTO pet_store.customer SET ?";
    let data = {
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        password : req.body.password
    };
    conn.query(sql, data, (err, results) => {
        if(err) {
            req.flash('err', 'Error, Try Again');
            res.redirect('/user/user_sign_up');
        }else {
            req.flash('success', 'Added Successfully');
            res.redirect('/login/user_login');
        }
    });
});

/* ******************************************************************************** */
// Get product detail
router.get('/product_info/:id', function(req, res, next) {
    if (req.session.loggedin == true) {
        conn.query('SELECT *, now() AS sale_date FROM pet_store.product WHERE Id='+ req.params.id, function(err, results)     {
            if(err){
                req.flash('error', err); 
                res.render('user/item_page',
                {
                    title: "Product Page",
                    products: ''
                });   
            }else {
                req.flash('success')
                res.render('user/item_page',
                {
                    title: "Product Page",
                    products: results[0],
                    my_session : req.session
                });
            }               
        });
    }else {
        res.redirect('/login/user_login')
    }
});

// Push Info to customer Sale
router.post('/cust_sales', (req, res) => {
    let sql = "INSERT INTO pet_store.customer_sale SET ?";
    let data = {
        customer_id : req.body.customer_id,
        product_id : req.body.product_id,
        total_sale_amount : req.body.total_sale_amount,
        sale_date : req.body.sale_date
    };
    conn.query(sql, data, (err, results) => {
        if(err) {
            req.flash('err', 'Error, Try Again');
            // res.redirect('/user/view_item');
        }else {
            req.flash('success', 'Added Successfully');
            res.redirect('/user/view_item');

        }
    });
});

module.exports = router;
