const STATIC = {
  BASE_URL: "http://localhost:3000"
}

class Player {
  static genereateElement(player) {
    return `
    <div class="group relative block bg-black w-64 rounded-md hover:scale-105">
      <img
        src=${player.imageUrl}
        class="rounded-md absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />
    
      <div class="relative p-8">
        <div class="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <p class="text-sm font-medium uppercase tracking-widest text-pink-500">
            ${player.nationality}
          </p>
          <p class="text-2xl font-bold text-white">${player.name}</p>
          <div class="mt-32">
            <p class="text-2xl font-bold text-white">
              RANK #${player.rank}
            </p>
          </div>
        </div>
      </div>
    </div>
    `
  }

  static insertBulkElement(players) {
    const html = players.map(player => Player.genereateElement(player)).join("\n")
    $('#player-container').html(html)
  }

  static getPlayers() {
    $.ajax({
      url: `${STATIC.BASE_URL}/players`,
      method: `GET`,
      headers: {
        access_token: localStorage.access_token
      }
    })
      .done(result => {
        Player.insertBulkElement(result)
      })
  }

  static addPlayer() {
    const data = {
      name: $('#p-name').val(),
      nationality: $('#p-nationality').val(),
      rank: $('#p-rank').val(),
      imageUrl: $('#p-image-url').val(),
    }

    $.ajax({
      url: `${STATIC.BASE_URL}/players`,
      method: `POST`,
      headers: {
        access_token: localStorage.access_token
      },
      data
    })
      .done(() => {
        Player.getPlayers()
        $('#player-container').show()
        $('#add-player-container').hide()
      })
  }

  static registerPostEvent() {
    $('#add-player-form').on('submit', function(ev) {
      ev.preventDefault()
      confirmAction('Are you sure already fill the correct input?', Player.addPlayer)
    })
  }
}

class UserInterface {
  static showLoader() {
    const loader = $('#loader')
    loader.show()
  }
  
  static hideLoader() {
    const loader = $('#loader')
    loader.hide()
  }

  static bindNavigate() {
    $('#player-container').show()
    $('#add-player-container').hide()

    $('#home-nav').on('click', function() {
      $('#player-container').show()
      $('#add-player-container').hide()
    })

    $('#add-player-nav').on('click', function() {
      $('#player-container').hide()
      $('#add-player-container').show()
    })
  }
}

class Auth {
  static login() {
    $.ajax({
      method: 'POST',
      url: `${STATIC.BASE_URL}/login`,
      data: {
        email: $("#login-email").val(),
        password: $("#login-password").val()
      }
    })
      .done(result => {
        localStorage.setItem('access_token', result.access_token)
        $('#home').show()
        $('#login').hide()
        Player.getPlayers()
      }) 
  }

  static bindLogin() {
    $("#form-login").on("submit", function(event) {
      event.preventDefault()
      Auth.login()
    })
  }
}

$(document).ready(function () {
  Player.registerPostEvent()
  UserInterface.bindNavigate()
  UserInterface.hideLoader()
  Auth.bindLogin()
  
  if(localStorage.access_token) {
    $('#home').show()
    $('#login').hide()
    Player.getPlayers()
  } else {
    $('#home').hide()
    $('#login').show()
  }
})

$(document).ajaxStart(function(){
  UserInterface.showLoader()
});

$(document).ajaxComplete(function(ev, xhr, settings){ 
  UserInterface.hideLoader()

  const { responseJSON, status } = xhr
  if([500, 400].includes(status)) {
    Popup.fire({
      title: 'Something went wrong',
      text: "We're really sorry, please try again later"
    })
  }
});

$(document).ajaxSuccess(function() { $('input').val('') })