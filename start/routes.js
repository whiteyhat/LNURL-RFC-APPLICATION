'use strict'

const Route = use('Route')

Route.on('/').render('welcome')

// Withdrawal routes group
Route.group(() => {
    Route.get('request', 'LnurlController.requestWithdrawal')
    Route.get('confirmation', 'LnurlController.confirmWithdrawal')
    Route.get('execute', 'LnurlController.executeWithrawal')
  }).prefix('withdraw')
