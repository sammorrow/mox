import Vue from 'vue'
import Router from 'vue-router'
import GameController from '@/components/GameController'
import Lobby from '@/components/Lobby'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/g/:id',
      name: 'GameController',
      component: GameController,
      props: true
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      props: true
    }
  ]
})
