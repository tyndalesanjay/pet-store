var express = require('express');
var router = express.Router();
var conn = require('../lib/db');

// Get Products
router.get('/view_products', (req, res) => {
    // let sql = 'SELECT pt.*, ad.fName, ad.lName FROM pet_store.product pt, pet_store.admin ad WHERE pt.updated_by = ad.id'
    let sql = 'SELECT pt.*, ad.fName, ad.lName FROM pet_store.product pt, pet_store.admin ad WHERE updated_by = ad.id ORDER BY id'
    if (req.session.loggedin == true) {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('admin/products/view_products',
                {
                    title: 'Inventory List',
                    products: ''
                })
            }else {
                res.render('admin/products/view_products',
                {
                    title: 'Inventory List',
                    products: results,
                    my_session : req.session

                }
                )
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Get Add product
router.get('/add_products', (req, res) => {
    if (req.session.loggedin == true) {
        res.render('admin/products/add_product', 
        {
            title: 'Add Product',
            my_session : req.session
        })
    }else {
        res.redirect('/login')
    }
});

// Add product
router.post('/add_item', (req, res) => {
    let sql = "INSERT INTO pet_store.product SET ?";
    let data = {
        product_name : req.body.product_name,
        product_description : req.body.product_descrip,
        inventory_count : req.body.inventory_count,
        store_cost : req.body.store_cost,
        sale_cost : req.body.sale_cost,
        updated_by : req.body.updated_by 
    };
    if (req.session.loggedin == true) {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('err', 'Error, Try Again');
                res.redirect('/products/add_products');
                // res.send("error")
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/products/add_products');
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Delete Product
router.get('/delete/:id', (req, res) => {
    if (req.session.loggedin == true) {
        conn.query('DELETE FROM pet_store.product WHERE id=' + req.params.id, (err, results) => {
            if (err) {
                req.flash('error', 'Could Not Delete')
                res.redirect('/products/view_products')
            }else {
                req.flash('success', 'Employee Deleted')
                res.redirect('/products/view_products')
            }
        });
    }else {
        res.redirect('/login')
    }
});

// Get Product Edit
router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin == true) {
        conn.query('SELECT * FROM pet_store.product WHERE Id='+ req.params.id, function(err, results)     {
            if(err){
                req.flash('error', err); 
                res.render('admin/products/edit_product',
                {
                    title: "Employee Edit",
                    products: ''
                });   
            }else {
                req.flash('success')
                res.render('admin/products/edit_product',
                {
                    title: "Product Edit",
                    products: results[0],
                    my_session : req.session
                });
            }               
        });
    }else {
        res.redirect('/login')
    }
});

// Post product Update
router.post('/update', (req, res) => {
    let data = {
        id : req.body.id,
        product_name : req.body.product_name,
        product_description : req.body.product_descrip,
        inventory_count : req.body.inventory_count,
        store_cost : req.body.store_cost,
        sale_cost : req.body.sale_cost,
        updated_by : req.body.updated_by 
    };
    if (req.session.loggedin == true) {
        conn.query('UPDATE pet_store.product SET ? WHERE id =' + req.body.id, data, (err, results) => {
            console.log(req.body.id)
            if (err) {
                req.flash('err', 'Could Not Update');
                res.redirect('/products/view_products');
            }else {
                req.flash('success', 'Employee Updated');
                res.redirect('/products/view_products');
            }
        });
    }else {
        res.redirect('/login')
    }
});

module.exports = router;