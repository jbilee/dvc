import { $ } from "../utilities.js";

const CalculatorView = {
  renderKo() {
    $("#main-box").innerHTML = `
      <span id="settings">
        <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        </svg>
      </span>

      <div id="header">
        <button class="menu-button" disabled>노력치 계산기</button>
        <button class="menu-button" onclick="location.href='https://jbilee.github.io/dvc/find/'">성격 탐색기</button>
      </div>

      <div id="main-content">
        <div id="calculations">
          <div class="grid-container">
            <div></div>
            <div>
              <h3>기본치</h3>
            </div>
            <div></div>
            <div>
              <h3>목표치</h3>
            </div>
            <div>
              <div class="stat-label">순발력</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-agility"
                class="stat-field agility">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-agility"
                class="stat-field agility">
            </div>
            <div>
              <div class="stat-label">근력</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-strength"
                class="stat-field strength">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-strength"
                class="stat-field strength">
            </div>
            <div>
              <div class="stat-label">집중력</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-focus"
                class="stat-field focus">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-focus"
                class="stat-field focus">
            </div>
            <div>
              <div class="stat-label">지력</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-intellect"
                class="stat-field intellect">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-intellect"
                class="stat-field intellect">
            </div>
          </div>

          <div class="grid-container2">
            <div class="grid-item">
              <h3>필요 훈련 횟수</h3>
            </div>

            <div>
              <span id="required-agility"></span>
              <span class="stat-mobile-view">순발력</span>
            </div>
            <div>
              <span id="train-count-agility"></span>
            </div>
            <div>
              <span id="required-strength"></span>
              <span class="stat-mobile-view">근력</span>
            </div>
            <div>
              <span id="train-count-strength"></span>
            </div>
            <div>
              <span id="required-focus"></span>
              <span class="stat-mobile-view">집중력</span>
            </div>
            <div>
              <span id="train-count-focus"></span>
            </div>
            <div>
              <span id="required-intellect"></span>
              <span class="stat-mobile-view">지력</span>
            </div>
            <div>
              <span id="train-count-intellect"></span>
            </div>
          </div>
        </div>

        <div id="controls">
          <div class="sel1">
            <h3>드래곤 정보 자동입력:</h3>
            <select name="dragon-selector" id="dragon-selector">
              <option selected disabled>드래곤 선택</option>
            </select>
            <select name="trait-selector" id="start-trait-selector" disabled>
              <option selected disabled>성격 선택</option>
              <option value="" id="trait1">-</option>
              <option value="" id="trait2">-</option>
            </select>
          </div>

          <div class="sel2">
            <h3>목표치 자동입력:</h3>
            <select name="trait-selector" id="normal-trait-selector">
              <option selected disabled>일반성격 선택</option>
            </select>
            <select name="trait-selector" id="special-trait-selector">
              <option selected disabled>특수성격 선택</option>
            </select>
          </div>
        </div>

        <div class="buttons">
          <button class="primary" id="btn-calculate">계산하기</button>
          <button id="btn-reset">목표치 초기화</button>
          <button id="btn-clipboard">결과 복사</button> <br>
        </div>

        <div class="conditions">
          <div>
            <input id="poisoned" type="checkbox"><label for="poisoned">맹독 적용하기</label>
          </div>
        </div>

        <div id="tips">
          <h2>[툴 이용가이드]</h2>
          <ul>
            <li><b>결과 복사</b> 버튼으로 훈련 횟수를 텍스트 형식으로 복사할 수 있습니다.</li>
            <li>동일한 점수의 훈련 횟수가 5회를 초과하면 괄호 형식으로 축소됩니다. <br> (예: <span class="nine">9</span><sub>(x13)</sub>일 경우 9점짜리 훈련을
              13회 진행)</li>
            <li>훈련할 값을 직접 계산해야 하는 성격만 자동입력에 포함되어 있습니다.</li>
            <li>에브리아 전용 드래곤은 기본치가 고정이기 때문에 자동입력에 포함되어 있지 않습니다.</li>
          </ul>
        </div>
      </div>

      <div class="version">
        <p>
          version 1.3.0 (24-03-22)<br>
          <strong>DVC Calculator by <a href="https://github.com/jbilee">jbilee</a></strong>
        </p>
        <p>
          <strong>데이터 출처:</strong><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/2929"
            target="_blank">앙그라님의 전체도감</a><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/9761"
            target="_blank">앙그라님의 일반성격 계산법</a><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/113031"
            target="_blank">순대국밥할매님의 성격 정리</a><br>
          <a href="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki"
            target="_blank">Fandom 위키</a><br>
        </p>
        <p>
          <strong>버그/데이터 오류 제보:</strong> <a href="https://open.kakao.com/o/stYLmUCf">오픈카톡</a>
        </p>
      </div>
    `;
  },
  renderEn() {
    $("#main-box").innerHTML = `
      <span id="settings">
        <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        </svg>
      </span>

      <div id="header">
        <button class="menu-button" disabled>Calculator</button>
        <button class="menu-button" onclick="location.href='https://jbilee.github.io/dvc/find/'">Finder</button>
      </div>

      <div id="main-content">
        <div id="calculations">
          <div class="grid-container">
            <div></div>
            <div>
              <h3>Base</h3>
            </div>
            <div></div>
            <div>
              <h3>Goal</h3>
            </div>
            <div>
              <div class="stat-label">Agility</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-agility"
                class="stat-field agility">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-agility"
                class="stat-field agility">
            </div>
            <div>
              <div class="stat-label">Strength</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-strength"
                class="stat-field strength">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-strength"
                class="stat-field strength">
            </div>
            <div>
              <div class="stat-label">Focus</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-focus"
                class="stat-field focus">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-focus"
                class="stat-field focus">
            </div>
            <div>
              <div class="stat-label">Intellect</div>
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" value="0" id="start-intellect"
                class="stat-field intellect">
            </div>
            <div>
              →
            </div>
            <div class="input-container">
              <input type="number" inputmode="numeric" min="0" max="999" maxlength="3" value="0" id="end-intellect"
                class="stat-field intellect">
            </div>
          </div>

          <div class="grid-container2">
            <div class="grid-item">
              <h3>Recommended Training</h3>
            </div>

            <div>
              <span id="required-agility"></span>
              <span class="stat-mobile-view">Agility</span>
            </div>
            <div>
              <span id="train-count-agility"></span>
            </div>
            <div>
              <span id="required-strength"></span>
              <span class="stat-mobile-view">Strength</span>
            </div>
            <div>
              <span id="train-count-strength"></span>
            </div>
            <div>
              <span id="required-focus"></span>
              <span class="stat-mobile-view">Focus</span>
            </div>
            <div>
              <span id="train-count-focus"></span>
            </div>
            <div>
              <span id="required-intellect"></span>
              <span class="stat-mobile-view">Intellect</span>
            </div>
            <div>
              <span id="train-count-intellect"></span>
            </div>
          </div>
        </div>

        <div id="controls">
          <div class="sel1">
            <h3>Dragon's base stats:</h3>
            <select name="dragon-selector" id="dragon-selector">
              <option selected disabled>Dragon</option>
            </select>
            <select name="trait-selector" id="start-trait-selector" disabled>
              <option selected disabled>Personality</option>
              <option value="" id="trait1">-</option>
              <option value="" id="trait2">-</option>
            </select>
          </div>

          <div class="sel2">
            <h3>Target personality:</h3>
            <select name="trait-selector" id="normal-trait-selector">
              <option selected disabled>Basic</option>
            </select>
            <select name="trait-selector" id="special-trait-selector">
              <option selected disabled>Special</option>
            </select>
          </div>
        </div>

        <div class="buttons">
          <button class="primary" id="btn-calculate">Calculate</button>
          <button id="btn-reset">Reset Goal</button>
          <button id="btn-clipboard">Copy</button> <br>
        </div>

        <div class="conditions">
          <div>
            <input id="poisoned" type="checkbox"><label for="poisoned">Inject Venom</label>
          </div>
        </div>

        <div id="tips">
          <h2>[Tips]</h2>
          <ul>
            <li>Use the <b>Copy</b> button to copy the recommended training sessions to clipboard.</li>
            <li>The number of training sessions for a given Effort Value will stack if 6 times or more, for condensed view. <br> (ex: <span class="nine">9</span><sub>(x13)</sub> is equal to doing Perfect training 13 times)</li>
            <li>Only the personalities that require calculations are listed in the dropdown menus.</li>
            <li>Evria-exclusives are not included in the dropdown menu as they all have the same base stats.</li>
          </ul>
        </div>
      </div>

      <div class="version">
        <p>
        version 1.3.0 (24-03-22)<br>
          <strong>DVC Calculator by <a href="https://github.com/jbilee">jbilee</a></strong>
        </p>
        <p>
          <strong>Sources:</strong><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/2929"
            target="_blank">Dragondex by 앙그라</a><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/9761"
            target="_blank">Normal personality calculations by 앙그라</a><br>
          <a href="https://community.withhive.com/dvc/ko/board/22/113031"
            target="_blank">Personality requirements by 순대국밥할매</a><br>
          <a href="https://dragon-village-collection.fandom.com/wiki/Dragon_Village_Collection_Wiki"
            target="_blank">Fandom Wiki</a><br>
        </p>
        <p>
          If you come across any bugs or other issues, please DM me on <a href="https://twitter.com/horocol">Twitter</a>!
        </p>
      </div>
    `;

    $("title").textContent = "DVC Calculator";
  },
};

export default CalculatorView;
