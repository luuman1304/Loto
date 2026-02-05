const authStatus = document.getElementById("authStatus");
const guestPlay = document.getElementById("guestPlay");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const roomList = document.getElementById("roomList");
const roomSection = document.getElementById("room");
const roomTitle = document.getElementById("roomTitle");
const playerList = document.getElementById("playerList");
const roomStatus = document.getElementById("roomStatus");
const toggleReady = document.getElementById("toggleReady");
const startGame = document.getElementById("startGame");
const leaveRoom = document.getElementById("leaveRoom");
const randomRoom = document.getElementById("randomRoom");
const createRoom = document.getElementById("createRoom");
const onlineCount = document.getElementById("onlineCount");
const roomCount = document.getElementById("roomCount");
const potValue = document.getElementById("potValue");
const currentNumber = document.getElementById("currentNumber");
const drawNumber = document.getElementById("drawNumber");
const numberHistory = document.getElementById("numberHistory");
const lotoCard = document.getElementById("lotoCard");
const claimWin = document.getElementById("claimWin");
const gameResult = document.getElementById("gameResult");

const rooms = [
  { id: 1, name: "Lộc Xuân", players: 8, host: "Chủ phòng A" },
  { id: 2, name: "Phú Quý", players: 12, host: "Chủ phòng B" },
  { id: 3, name: "Mai Vàng", players: 5, host: "Chủ phòng C" },
  { id: 4, name: "Khai Lộc", players: 16, host: "Chủ phòng D" },
  { id: 5, name: "Sum Vầy", players: 9, host: "Chủ phòng E" },
  { id: 6, name: "An Khang", players: 2, host: "Chủ phòng F" },
  { id: 7, name: "Thịnh Vượng", players: 14, host: "Chủ phòng G" },
  { id: 8, name: "Bình An", players: 6, host: "Chủ phòng H" },
];

let currentUser = { name: "Khách", role: "guest", ready: false };
let activeRoom = null;
let roomPlayers = [];
let drawnNumbers = [];
let totalPot = 0;
let winners = [];

const scrollButtons = document.querySelectorAll("[data-scroll]");
scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

const updateAuthStatus = (message) => {
  authStatus.textContent = message;
};

const updateLobbyStats = () => {
  onlineCount.textContent = 120 + Math.floor(Math.random() * 60);
  roomCount.textContent = rooms.length;
};

const renderRooms = () => {
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${room.name}</h3>
      <p>Chủ phòng: <strong>${room.host}</strong></p>
      <p>Số người: ${room.players}/16</p>
      <button class="btn btn--primary" data-room="${room.id}">Vào phòng</button>
    `;
    card.querySelector("button").addEventListener("click", () => joinRoom(room.id));
    roomList.appendChild(card);
  });
};

const seedPlayers = () => {
  const basePlayers = [
    { name: "Lì xì đỏ", ready: true },
    { name: "Bánh chưng", ready: false },
    { name: "Hoa đào", ready: true },
    { name: "Pháo hoa", ready: false },
  ];
  roomPlayers = basePlayers.slice(0, Math.max(1, Math.floor(Math.random() * 4)));
  roomPlayers.push({ name: currentUser.name, ready: currentUser.ready, isYou: true });
};

const renderPlayers = () => {
  playerList.innerHTML = "";
  roomPlayers.forEach((player) => {
    const item = document.createElement("li");
    const status = player.ready ? "Sẵn sàng" : "Chưa sẵn sàng";
    item.innerHTML = `
      <span>${player.name}${player.isYou ? " (Bạn)" : ""}</span>
      <strong>${status}</strong>
    `;
    playerList.appendChild(item);
  });
  const readyCount = roomPlayers.filter((player) => player.ready).length;
  roomStatus.textContent = `${readyCount}/${roomPlayers.length} sẵn sàng`;
};

const generateCardNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 15) {
    numbers.add(1 + Math.floor(Math.random() * 90));
  }
  return Array.from(numbers);
};

const renderLotoCard = () => {
  lotoCard.innerHTML = "";
  const numbers = generateCardNumbers();
  numbers.forEach((number) => {
    const button = document.createElement("button");
    button.textContent = number;
    button.addEventListener("click", () => {
      button.classList.toggle("active");
    });
    lotoCard.appendChild(button);
  });
};

const resetGame = () => {
  drawnNumbers = [];
  winners = [];
  totalPot = roomPlayers.length * 5;
  potValue.textContent = totalPot;
  currentNumber.textContent = "--";
  numberHistory.innerHTML = "";
  gameResult.textContent = "Chưa có người thắng.";
  renderLotoCard();
};

const joinRoom = (roomId) => {
  activeRoom = rooms.find((room) => room.id === roomId) || rooms[0];
  roomTitle.textContent = `Phòng ${activeRoom.name}`;
  roomSection.classList.remove("hidden");
  seedPlayers();
  renderPlayers();
  resetGame();
  roomSection.scrollIntoView({ behavior: "smooth" });
};

const randomJoin = () => {
  const room = rooms[Math.floor(Math.random() * rooms.length)];
  joinRoom(room.id);
};

const createNewRoom = () => {
  const newRoom = {
    id: rooms.length + 1,
    name: `Phòng ${rooms.length + 1}`,
    players: 1,
    host: currentUser.name,
  };
  rooms.push(newRoom);
  renderRooms();
  joinRoom(newRoom.id);
};

const setUser = (name, role) => {
  currentUser = { name, role, ready: false };
  updateAuthStatus(`Xin chào ${name}! Bạn đang chơi với vai trò ${role === "guest" ? "khách" : "thành viên"}.`);
};

const updateReadyState = () => {
  const you = roomPlayers.find((player) => player.isYou);
  if (!you) return;
  you.ready = !you.ready;
  toggleReady.textContent = you.ready ? "Hủy sẵn sàng" : "Sẵn sàng";
  renderPlayers();
};

const startMatch = () => {
  const allReady = roomPlayers.every((player) => player.ready);
  if (!allReady || roomPlayers.length < 2) {
    gameResult.textContent = "Cần ít nhất 2 người và tất cả sẵn sàng để bắt đầu.";
    return;
  }
  gameResult.textContent = "Ván chơi bắt đầu! Chủ phòng đã mở bốc số.";
  resetGame();
};

const drawNewNumber = () => {
  if (drawnNumbers.length >= 90) {
    gameResult.textContent = "Đã bốc hết số. Hãy bắt đầu ván mới!";
    return;
  }
  let number = 1 + Math.floor(Math.random() * 90);
  while (drawnNumbers.includes(number)) {
    number = 1 + Math.floor(Math.random() * 90);
  }
  drawnNumbers.push(number);
  currentNumber.textContent = number;
  const badge = document.createElement("span");
  badge.textContent = number;
  numberHistory.prepend(badge);
};

const claimVictory = () => {
  const marked = Array.from(lotoCard.querySelectorAll("button.active")).length;
  const total = lotoCard.querySelectorAll("button").length;
  if (marked !== total) {
    gameResult.textContent = "Bạn cần đánh dấu đủ số trên vé để Kinh!";
    return;
  }
  if (!winners.includes(currentUser.name)) {
    winners.push(currentUser.name);
  }
  const share = Math.floor(totalPot / winners.length);
  gameResult.textContent = `${winners.join(", ")} đã Kinh! Mỗi người nhận ${share} đậu.`;
};

guestPlay.addEventListener("click", () => {
  setUser("Khách xuân", "guest");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  setUser(formData.get("email"), "member");
  loginForm.reset();
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  setUser(formData.get("name"), "member");
  registerForm.reset();
});

randomRoom.addEventListener("click", randomJoin);
createRoom.addEventListener("click", createNewRoom);
startGame.addEventListener("click", startMatch);
toggleReady.addEventListener("click", updateReadyState);
leaveRoom.addEventListener("click", () => roomSection.classList.add("hidden"));
drawNumber.addEventListener("click", drawNewNumber);
claimWin.addEventListener("click", claimVictory);

updateLobbyStats();
renderRooms();
renderLotoCard();
