const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const { STRING } = require('sequelize')
const bodyparser = require('body-parser')

app.use(bodyparser.json())
bodyparser.urlencoded({extended: false})

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})

const Sequelize = require('sequelize')
const db = new Sequelize('another', 'seth.king', 'Poiop90lik8', {
    host: 'localhost',
    dialect: 'postgres'
})

const Post = db.define('post', {
    title: {
        type: STRING
    },
    body: {
        type: STRING
    }
})

app.get('/api/posts', async(req, res)=>{
    res.send(await Post.findAll())
})
app.post('/api/posts', async(req, res)=>{
   res.send(await Post.create(req.body))
})

app.put('/api/posts/:id', async(req, res)=>{
    const id = req.params.id
    Post.update(
        {title: req.body.title, body: req.body.body},
        {where: { id: id}}
    ).then(()=>{
        res.sendStatus(200)
    })
})

app.delete('/api/posts/:id', async(req, res)=>{
    const id = req.params.id
    const post = await Post.findByPk(id)
    if (post){
        await post.destroy()
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
const syncAndSeed = async() =>{
    await db.sync({ force: true })
    await Promise.all([
        Post.create({
            title: 'the beginnig',
            body: 'hellohejeeleo'
        }),
        Post.create({
            title: 'another post',
            body: 'weee'
        }).then(()=>{
            console.log('sycned data')
        })
    ])
}

syncAndSeed()