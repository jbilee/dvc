import { $, newElem } from "../utilities.js";

const ModalView = {
  render() {
    const container = newElem("div");
    container.classList.add("modal");
    // container.classList.add("modal__inactive");

    const modalBackground = newElem("div");
    modalBackground.classList.add("modal-background");

    const modalWindow = newElem("div");
    modalWindow.classList.add("modal-foreground");
    modalWindow.innerHTML = `
    <div>
      <h2>설정</h2>
      <button id="close-modal">X</button>
    </div>
    <div>
      <h3>즐겨찾기</h3>
      즐겨찾기에 추가한 이름이 자동완성 목록의 최상단에 노출됩니다.
      <select></select>
      <button id="add-fav">+</button>
      <div id="favorites"></div>
    </div>
    <div>
      <h3>계산</h3>
      <div class="checkbox-option">
        <div>높은 점수 위주로 계산하기
        가능한 한 9점 → 5점 → 3점 순으로 훈련하도록 설정합니다. 단, 훈련 시간이 늘어나게 되는 경우 이 설정은 무시합니다.
        </div>
      </div>
      <div class="checkbox-option">
        <div>선호 훈련 지정하기
        선택권이 주어질 경우, 내가 선호하는 훈련의 노력치를 올리도록 설정합니다.
        </div>
      </div>
    </div>
    `;

    container.append(modalWindow);
    container.append(modalBackground);
    document.body.append(container);

    $("#close-modal").addEventListener("click", () =>
      container.classList.add("modal__inactive")
    );
  },
};

export default ModalView;
