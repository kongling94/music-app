<template>
  <div class="zfb-pay"
       v-if="show">
    <div class="content">
      <!--标题栏-->
      <header class="pay-title">
        <div class="ico-back"
             @click="cancel"></div>
        <h3>{{title}}</h3>
      </header>

      <!--密码框-->
      <div class="pass-box">
        <ul class="pass-area">
          <li class="pass-item"
              :class="{on: password.length > index}"
              v-for="(item, index) in digit"
              :key="index"></li>
        </ul>
      </div>

      <!--忘记密码-->
      <div class="forget-pass">
        <div class="forget-pass-btn"
             @click="forget">忘记密码</div>
      </div>

      <!--键盘区-->
      <ul class="keyboard">
        <li @click="onKeyboard(1)">
          <p class="num">
            <strong>1</strong>
          </p>
          <p class="character"></p>
        </li>
        <li @click="onKeyboard(2)">
          <p class="num">
            <strong>2</strong>
          </p>
          <p class="character">ABC</p>
        </li>
        <li @click="onKeyboard(3)">
          <p class="num">
            <strong>3</strong>
          </p>
          <p class="character">DEF</p>
        </li>
        <li @click="onKeyboard(4)">
          <p class="num">
            <strong>4</strong>
          </p>
          <p class="character">GHI</p>
        </li>
        <li @click="onKeyboard(5)">
          <p class="num">
            <strong>5</strong>
          </p>
          <p class="character">JKL</p>
        </li>
        <li @click="onKeyboard(6)">
          <p class="num">
            <strong>1</strong>
          </p>
          <p class="character">MNO</p>
        </li>
        <li @click="onKeyboard(7)">
          <p class="num">
            <strong>7</strong>
          </p>
          <p class="character">PQRS</p>
        </li>
        <li @click="onKeyboard(8)">
          <p class="num">
            <strong>8</strong>
          </p>
          <p class="character">TUV</p>
        </li>
        <li @click="onKeyboard(9)">
          <p class="num">
            <strong>9</strong>
          </p>
          <p class="character">WXYZ</p>
        </li>
        <li class="none"></li>
        <li class="zero"
            @click="onKeyboard(0)">
          <strong>0</strong>
        </li>
        <li class="delete"
            @click="deleteKey"></li>
      </ul>

      <!--加载中状态-->
      <div class="loading-wrap"
           v-if="payStatus !== 0">
        <div class="loading">
          <!--加载图标-->
          <img src="@/assets/loading.png"
               class="loading-ico"
               alt=""
               v-if="payStatus === 1">
          <img src="@/assets/success.png"
               class="success-ico"
               alt=""
               v-if="payStatus === 2">
          <!--加载文字-->
          <p v-if="payStatus === 1">{{loadingText}}</p>
          <p v-if="payStatus === 2">{{finishedText}}</p>
        </div>
      </div>

      <!--支付失败提示框-->
      <div class="pay-fail"
           v-if="isShowFail">
        <div class="pay-fail-lay">
          <h3 class="title">{{failTip}}</h3>
          <div class="btns">
            <div @click="reInput">重新输入</div>
            <div @click="forget">忘记密码</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
