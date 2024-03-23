

import Route from '@ioc:Adonis/Core/Route'

//api routes
Route.group(()=>{
Route.post('/signup','controller.registerUser')
Route.post('/login','controller.login')
Route.put('/update/:id','controller.update')
Route.delete('/deleteUser/:id','controller.deleteUser')
Route.post('/deleteUsers','controller.deleteMultipleUsers')
Route.get('/fetchUsers','controller.fetchUsers')
Route.get('/fetchUser/:username','controller.fetchUser')
Route.post('/changePassword','controller.changePassword')
}).prefix('/api')

//routes
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/signup', async ({ view }) => {
  return view.render('signup')
})
Route.get('/login', async ({ view }) => {
  return view.render('login')
})
Route.get('/dashboard', async ({ view }) => {
  return view.render('dashboard')
})
Route.get('/userdash', async ({ view }) => {
  return view.render('userdash')
})