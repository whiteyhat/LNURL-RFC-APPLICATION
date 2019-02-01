'use strict'

const Route = use('Route')

Route.on('/').render('welcome')

Route.get('signup', 'LnurlController.createUser')
Route.get('/withdraw/request', 'LnurlController.requestWithdrawal')
Route.get('conf', 'LnurlController.confirmWithdrawal')

// Withdrawal routes group
Route.group(() => {
    Route.get('execute', 'LnurlController.executeWithrawal')
  }).prefix('withdraw')
