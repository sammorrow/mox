<template>
<div class="player-view">
    <img v-bind:src="imageScry('00')" />
    <div class="stats-sheet">
        <h2> Stats </h2>
        <div class="stats-box">
            <div>
                <img class="stat-icon" title="health" v-bind:src="imageScry('a-5')"/>
                <span> {{ state.health }} </span>
            </div>
            <div>
                <img class="stat-icon" title="grit" v-bind:src="imageScry('a-6')"/>
                <span> {{ state.grit }} </span>
            </div>
        </div>
        <div class="action-box">
            <span> -1 : {{ computeGrit(-1) }} </span>
            <div class="action-bar">
                <span v-bind:key="index" v-for="(point, index) in actionPoints" class="action-point" v-bind:class="parseClass(point)"></span>
            </div>
            <span> +1 : {{ computeGrit(+1) }} </span>
        </div>
        <div class="attributes">
            <div>
                <img class="attribute-icon" title="movement" @click="incrementTrack('movement')" v-bind:src="imageScry('a-1')"/>
                <span  :key="`m-${idx}`" v-for="(point, idx) in getPoints('movementPoints')" class="attribute-cube" v-bind:class="parseClass(point)"/>
                <span>{{state.movement}}</span>
            </div>
            <div>
                <img  class="attribute-icon" title="perception" @click="incrementTrack('perception')" v-bind:src="imageScry('a-2')"/>
                <span  :key="`p-${idx}`" v-for="(point, idx) in getPoints('perceptionPoints')" class="attribute-cube" v-bind:class="parseClass(point)"/>
                <span>{{state.perception}}</span>
            </div>
            <div>
                <img  class="attribute-icon" title="strength" @click="incrementTrack('strength')" v-bind:src="imageScry('a-3')"/>
                <span :key="`s-${idx}`" v-for="(point, idx) in getPoints('strengthPoints')" class="attribute-cube" v-bind:class="parseClass(point)"/>
                <span>{{state.strength}}</span>
            </div>
        </div>
    </div>
    <div class="ability-list">
        <div><img v-bind:src="imageScry('01')" /><button @click="useKnightPassive('bomb')"> bomb </button></div>
        <div><img v-bind:src="imageScry('02')" /><button @click="bow"> bow (tbf) </button></div>
        <div><img v-bind:src="imageScry('03')" /><button @click="ancientMap"> map </button></div>
        <div><img v-bind:src="imageScry('04')" /><button @click="useKnightPassive('shield')"> shield </button></div>
    </div>
    <div class="loot">
        <h2> Loot </h2>
    </div>
    <div>
        <input v-model="grit"/>
        <button @click="setGrit"> CHANGE GRIT </button>
        <config></config>
        <div v-if="state.state === 'combat'"> 
            <p> Adjust your strength and hit below when ready. </p>
            <button @click="resolveAmbush"> Resolve Combat </button>
        </div>
    </div>
    <div> 
        <h2> Sidequests </h2>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import config from '../modular/ArbitrationInterface'
const imageSet = require.context('../../assets/knight-view', false, /\.png$/)

const gritArray = ["Min", 5, 11, 17, 26, 35, "Max"]

export default {
    name: 'KnightView',
    data () {
        return {grit: 0}
    },
    components: {
        config
    },
    computed: {
        state () {
            return this.$store.state.knight
        },
        getPoints(){
            return this.$store.getters.getPoints
        },
        actionPoints () {
            return new Array(this.state.availableAP).fill(1).concat(new Array(this.state.totalAP - this.state.availableAP).fill(0))
        }
    },
    methods: {
        ...mapActions([
            'startKnightTurn',
            'spendPoint',
            'determineGrit',
            'ancientMap',
            'shield',
            'bow',
            'bomb',
            'useKnightPassive',
            'resolveAmbush'
        ]),
        imageScry(numStr) {
            return imageSet(`./${numStr}.png`)
        },
        parseClass(bool) {
            return bool ? "active" : "inactive"
        },
        incrementTrack(type){
            if (this.state.availableAP < 1) console.log('no AP left')
            else if (this.state[`${type}Points`] < 3) this.spendPoint({type})
            else console.log('max points spent')
        },
        logState(){
            console.log(this.state)
        },
        setGrit(){
            this.determineGrit({quantity: +this.grit})
        },
        computeGrit(opt){
            let currentGrit = 1;
            gritArray.forEach((tier, idx) => {
                if (tier <= this.state.grit) currentGrit = idx
            })
            return gritArray[currentGrit + opt]
        }
    }
}
</script>

<style scoped>

.attribute-icon {
    cursor: pointer;
}

.attribute-icon:hover{
    opacity: 0.9;
}

.attribute-cube {
    display: inline-block;
    height: 1.5rem;
    width: 1.5rem;
    background-color: #ffdf68;
}

.action-box {
    display: flex;
}

.action-bar {
    display: flex;
    min-width: 13.12rem;
    border: 1px solid orangered;
}

.action-bar span {
    display: inline-block;
    width: 1.75rem;
    height: 0.75rem;
    border: 1px solid orangered;
}

.active {
    background-color: #ffdf68;
}

.inactive {
    background-color: #a1792e;
}
.player-view {
    display: flex;
    flex-flow: row wrap;
}
.ability-list {
    display: flex;
    flex-flow: row wrap;
}
.ability-list > div {
    margin: 5px;
    display: flex; 
    flex-basis: calc(34%);  
    justify-content: center;
    flex-direction: column;
}

.ability-list > div > img {
    height: 100%;
    overflow: hidden;
}

.stats-sheet {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
}

.stats-box {
    display: flex;
}

.stat-icon {
    width: 2rem;
    height: 2rem;
}

</style>