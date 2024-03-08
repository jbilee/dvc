import { $, newElem } from "../utilities.js";

const ModalView = {
  render() {
    const container = newElem("div");
    container.classList.add("modal");
    container.classList.add("modal__inactive");

    const modalBackground = newElem("div");
    modalBackground.classList.add("modal-background");

    const modalWindow = newElem("div");
    modalWindow.classList.add("modal-foreground");
    modalWindow.innerHTML = `
    <div class="modal-header">
      <h2>설정</h2>
      <div id="close-modal"><img src="../img/close.png" width="18px"></div>
    </div>
    <div class="modal-option">
      <span class="helper warning">*설정은 기기 또는 브라우저별로 저장됩니다. 캐시를 삭제하면 설정도 초기화됩니다.</span>
    </div>
    <div class="modal-option">
      <h3>즐겨찾기</h3>
      즐겨찾기에 추가한 드래곤이 자동완성 목록의 최상단에 노출됩니다.
      <div class="fav-selector-container">
        <select id="fav-selector"></select>
        <button id="add-fav">추가</button>
      </div>
      <div class="favorites-container">
        <div id="favorites">
          <div id="fav-default">
            즐겨찾기한 드래곤이 없습니다.
          </div>
        </div>
      </div>
    </div>
    <div class="modal-option">
      <h3>계산</h3>
      <div class="checkbox-option">
        <div><strong>훈련치 우선순위 설정</strong>
        <p>
          가능한 한 9점 → 5점 → 3점 순으로 훈련하도록 설정합니다. 성격 발현 조건상 불가능하거나 훈련 시간이 늘어나게 되는 경우 이 설정은 무시합니다.
        </p>
        </div>
        <div>
          <input id="priority" type="checkbox" checked> <label for="priority">높은 점수 위주로 훈련하기</label>
        </div>
      </div>
      <hr>
      <div class="checkbox-option">
        <div><strong>성실한 성격 방지</strong>
        <p>
          성실한 성격이 발현 가능 성격에서 배제되도록 훈련을 분산시킵니다.
        </p>
        </div>
        <div>
          <input id="noserious" type="checkbox" checked> <label for="noserious">성실 방지하기</label>
        </div>
      </div>
      <hr>
      <div class="checkbox-option">
        <div>
          <strong>선호 훈련 지정</strong>
          <p>
            선택권이 주어질 경우, 내가 선호하는 노력치를 우선적으로 훈련하도록 설정합니다.
          </p>
          <div id="preferences">
            <div>
              <div>
                <input type="radio" name="preference" id="pref-none" value="none" checked><label for="pref-none">없음</label>
              </div>
              <div>
                <input type="radio" name="preference" id="pref-agility" value="agility"><label for="pref-agility">순발력</label>
              </div>
              <div>
                <input type="radio" name="preference" id="pref-strength" value="strength"><label for="pref-strength">근력</label>
              </div>
              <div>
                <input type="radio" name="preference" id="pref-focus" value="focus"><label for="pref-focus">집중력</label>
              </div>
              <div>
                <input type="radio" name="preference" id="pref-intellect" value="intellect"><label for="pref-intellect">지력</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    container.append(modalWindow);

    // container.append(modalBackground);

    // modalBackground.append(modalWindow);
    // container.append(modalBackground)
    $("#main-content").append(container);

    container.addEventListener("click", (e) => {
      if (e.target === container) {
        container.classList.add("modal__inactive");
        $("#fav-selector").selectedIndex = 0;
        document.body.removeAttribute("style");
      }
    });

    $("#close-modal").addEventListener("click", () => {
      container.classList.add("modal__inactive");
      $("#fav-selector").selectedIndex = 0;
      document.body.removeAttribute("style");
    });
  },
};

export default ModalView;
