if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  {
    const addressBarGlip = document.querySelector('#address-bar-glip');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      addressBarGlip.addEventListener('click', () => {
        const balloon = document.querySelector('#balloon');
        balloon.style.display = (balloon.style.display === 'none' ? 'block' : 'none');
      });
    } else if (/Android/i.test(navigator.userAgent)) { 
      const span = addressBarGlip.querySelector('span');
      span.innerHTML = '全画面モードON';
      span.style.top = '-40px';
      span.style.transform = 'translateX(-50%)';
      span.style.fontSize = '25px';
      span.style.whiteSpace = 'nowrap';
      const balloon = document.querySelector('#balloon');
      balloon.style.display = 'none';
      addressBarGlip.addEventListener('click', () => {
        document.body.requestFullscreen();
        if (grippedWebGLTemplate.fullscreenOrientation) {
          screen.orientation.lock(grippedWebGLTemplate.fullscreenOrientation);
        }
      });
    }
    
    grippedWebGLTemplate.resize = unityResize;
  
    // 最初のリサイズ
    window.addEventListener('load', unityResize);
    
    // サイズ変更（画面回転・アドレスバー出現）が止まってから resizeDelayMilliseconds ミリ秒後にリサイズ
    window.addEventListener('resize', () => {
      grippedWebGLTemplate.resizeDelay();
    });
  }
  function unityResize() {
    const unityCanvas = document.querySelector('#unity-canvas');
    const addressBarGlip = document.querySelector('#address-bar-glip');
    const dummyControl = document.querySelector('#dummy-control');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const clientWidth = dummyControl.clientWidth;
    const clientHeight = dummyControl.clientHeight;
    const aspectRatio = grippedWebGLTemplate.aspectRatio;
    window.scroll({'top': 0});
    
    if (document.fullscreenElement) {
      if (grippedWebGLTemplate.aspectRatio) {
        const w = Math.min(width, height * aspectRatio);
        unityCanvas.style.width = `${w}px`;
        unityCanvas.style.height = `${w / aspectRatio}px`;
        unityCanvas.style.marginTop = `${(height - w / aspectRatio) / 2}px`; // アスペクト比維持の場合はゲーム画面を中央に持ってくる
      } else {
        unityCanvas.style.width = '100vw';
        unityCanvas.style.height = '100vh';
        unityCanvas.style.marginTop = '0';
      }
      addressBarGlip.style.display = 'none';
      return;
    }
      
    // スクロールでゲーム画面が移動しないようにする
    // if (!grippedWebGLTemplate.aspectRatio) { // ゲーム画面の可変アスペクト比の設定
    //   unityCanvas.style.position = 'fixed';
    //   unityCanvas.style.transform = 'translateX(-50%)';
    //   unityCanvas.style.width = `${width}px`;
    //   unityCanvas.style.height = `${height}px`;
    // } else
    // スクロールでゲーム画面が移動しないようにする
    if (grippedWebGLTemplate.useFixedCanvas) {
      unityCanvas.style.position = 'fixed';
      unityCanvas.style.transform = 'translateX(-50%)';
      if (grippedWebGLTemplate.aspectRatio) {
        unityCanvas.style.width = `min(100vw, 100vh * ${aspectRatio})`;
        unityCanvas.style.height = 'auto';
        unityCanvas.style.aspectRatio = aspectRatio;
        // const w = Math.min(clientWidth, clientHeight * aspectRatio);
        // unityCanvas.style.width = `${w}px`;
        // unityCanvas.style.height = `${w / aspectRatio}px`;
      }
    } else {
      unityCanvas.style.position = null;
      unityCanvas.style.transform = null;
      unityCanvas.style.aspectRatio = null;
      if (grippedWebGLTemplate.aspectRatio) {
        if (!unityCanvas.style.width.endsWith('%')) {
          unityCanvas.style.width = '100%';
          unityCanvas.style.height = '100%';
        }
        if ((width > height) === (aspectRatio > 1)) {
          // ゲーム画面がウィンドウからはみ出さないように縮小し、拡大はしない。
          // Minimal テンプレートのモバイル時のスタイル（body直下 width: 100%; height: 100%）を元に縮小する。
          const w = Math.min(clientWidth, clientHeight * aspectRatio);
          const size = w / clientWidth * 100;
          const oldSize = parseFloat(unityCanvas.style.width);
          if (size < oldSize) {
            unityCanvas.style.width = `${size}%`;
            unityCanvas.style.height = `${size}%`;
          }
        }
      }
    }
    // ゲーム画面のはみ出しとアスペクト比維持の設定
    if (grippedWebGLTemplate.overflowFromWindow) {
      if (grippedWebGLTemplate.aspectRatio) {
        // 上で設定した unityCanvas.style.width/height がここに対応する
      } else {
        unityCanvas.style.width = '100vw';
        unityCanvas.style.height = '100vh';
      }
    } else {
      if (grippedWebGLTemplate.aspectRatio) {
        const w = Math.min(width, height * aspectRatio);
        unityCanvas.style.width = `${w}px`;
        unityCanvas.style.height = `${w / aspectRatio}px`;
      } else {
        unityCanvas.style.width = `${width}px`;
        unityCanvas.style.height = `${height}px`;
      }
    }
      
    // アスペクト比維持の場合はゲーム画面を中央に持ってくる
    if (grippedWebGLTemplate.aspectRatio) {
      const h = Math.min(width / aspectRatio, height);
      unityCanvas.style.marginTop = `${(height - h) / 2}px`;
    } else {
      unityCanvas.style.marginTop = '0';
    }
    // スマホのアドレスバーをひっこめるための余白を作る
    const addressBarIsVisible = height < clientHeight;
    if (addressBarIsVisible) {
      document.body.style.overflow = null;
      document.body.style.marginBottom = '125vh'; // ひっこめるのに十分な幅があれば実装手段やサイズは問わない
      addressBarGlip.style.display = 'block'; // スクロール用のグリップを表示する
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.marginBottom = '0';
      if (/Android/i.test(navigator.userAgent)) {
        addressBarGlip.style.display = 'block';
      } else {
        addressBarGlip.style.display = 'none';
      }
    }
  }
}
// if (/Android/i.test(navigator.userAgent)) {
//   const addressBarGlip = document.querySelector('#address-bar-glip');
//   addressBarGlip.addEventListener('click', () => {
//     document.body.requestFullscreen();
//     if (grippedWebGLTemplate.fullscreenOrientation) {
//       screen.orientation.lock(grippedWebGLTemplate.fullscreenOrientation);
//     }
//   });
//   const span = addressBarGlip.querySelector('span');
//   span.innerHTML = '全画面モードON';
//   span.style.top = '-40px';
//   span.style.transform = 'translateX(-50%)';
//   span.style.fontSize = '25px';
//   span.style.whiteSpace = 'nowrap';
//   const balloon = document.querySelector('#balloon');
//   balloon.style.display = 'none';
//   grippedWebGLTemplate.resize = () => {
//     const unityCanvas = document.querySelector('#unity-canvas');
    
//     if (grippedWebGLTemplate.aspectRatio) {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       const aspectRatio = grippedWebGLTemplate.aspectRatio;
//       const w = Math.min(width, height * aspectRatio);
//       unityCanvas.style.width = `${w}px`;
//       unityCanvas.style.height = `${w / aspectRatio}px`;
//       unityCanvas.style.marginTop = `${(height - w / aspectRatio) / 2}px`; // アスペクト比維持の場合はゲーム画面を中央に持ってくる
//     } else {
//       unityCanvas.style.width = '100vw';
//       unityCanvas.style.height = '100vh';
//       unityCanvas.style.marginTop = '0';
//     }
  
//     if (document.fullscreenElement) {
//       addressBarGlip.style.display = 'none'; // フルスクリーン時グリップを非表示
//     } else {
//       addressBarGlip.style.display = 'block';
//     }
//   }
//   grippedWebGLTemplate.resize();
//   document.addEventListener('fullscreenchange', () => {
//     grippedWebGLTemplate.resizeDelay();
//   });
// }
