exports.homePage = (req, res) => {
    res.render('index', {
        title: 'Página <span style="color: red">Home</span>',
        numbers: [1, 2, 3, 4, 5, 6, 7]
    })
}

exports.sendForm = (req, res) => {
    res.send(req.body)
}
