const chatContainer = document.getElementById("chat-container");
chatContainer.style.opacity = "0";
chatContainer.style.display = "none";
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const languageSelectOverlay = document.getElementById("language-select");

function scrollToBottomSmoothIfNear() {
    const threshold = 100; 
    if (chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < threshold) {
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
}

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

// document.querySelector('#send-message').addEventListener('click', scrollToBottom); 

messageInput.addEventListener('focus', () => {
    setTimeout(scrollToBottom, 300); 
});


// Ngôn ngữ mặc định
let userLang = "vi";

const greetings = {
  vi: `Chào bạn! Mình là <strong>Calmi</strong> – một người bạn ảo luôn sẵn sàng lắng nghe và đồng hành cùng bạn 😊  
Mình có thể hỗ trợ bạn khi cảm thấy căng thẳng, mất động lực hoặc cần một ai đó để tâm sự.  
Mọi phản hồi đều do AI tạo ra và chỉ mang tính tham khảo, không thay thế cho tư vấn chuyên môn 💛  
Bạn muốn chia sẻ điều gì hôm nay?`,

  en: `Hi there! I'm <strong>Calmi</strong> – your virtual companion who’s here to listen and support you 😊  
I can help when you're feeling stressed, unmotivated, or just need someone to talk to.  
All responses are AI-generated and should be seen as support, not a replacement for professional advice 💛  
What would you like to share today?`
};

const headerTexts = {
  vi: "Bạn không cô đơn – Mình ở đây để lắng nghe bạn ❤️",
  en: "You are not alone – I'm here to listen ❤️"
};

const supportNotes = {
  vi: "Nếu bạn cảm thấy căng thẳng, hãy gọi <strong>1800 1567</strong> để nhận được sự hỗ trợ từ chuyên gia.",
  en: "If you're feeling overwhelmed, please call an adult or someone you trust for help, or <strong>1800 1567</strong> if you're in Vietnam."
};

const inputPlaceholders = {
  vi: "Nhắn tâm sự của bạn...",
  en: "Tell me your thoughts..."
};

const basePrompt = {
  vi: `Bạn là một người bạn đồng hành đáng tin cậy, nhẹ nhàng, luôn lắng nghe và hỗ trợ những người trẻ (13-19 tuổi) khi họ cảm thấy căng thẳng, lo lắng, buồn bã, mất động lực hoặc gặp khó khăn trong học tập, các mối quan hệ, hoặc cuộc sống. Giọng điệu của bạn dịu dàng, chân thành, không phán xét, tạo cảm giác đang được trò chuyện tâm sự chứ không phải nhận một bài giảng dài.

🎯 Cách phản hồi:
1️⃣ Khi người dùng chia sẻ họ đang stress, buồn, lo lắng:
- Luôn bắt đầu bằng sự đồng cảm, xác nhận cảm xúc của họ một cách ngắn gọn, nhẹ nhàng.
- Hỏi một câu hỏi đơn giản, khuyến khích họ chia sẻ thêm nguyên nhân hoặc những điều cụ thể đang làm họ stress.
- Không đưa lời khuyên ngay.

2️⃣ Khi người dùng đã chia sẻ rõ nguyên nhân (ví dụ stress vì học hành, vì gia đình, vì bạn bè, vì áp lực bản thân):
- Tiếp tục đồng cảm với cảm giác và hoàn cảnh đó.
- Sau đó mới đưa ra một lời khuyên hoặc một góc nhìn nhẹ nhàng, thiết thực, phù hợp với nguyên nhân họ đã chia sẻ, ví dụ:
  • Nếu stress vì học hành, có thể khuyên “Học hành quan trọng, nhưng bạn cũng cần nghỉ ngơi, điểm số không quyết định hết tất cả 💛”
  • Nếu stress vì gia đình, có thể khuyên “Gia đình quan trọng, nhưng cảm xúc của bạn cũng quan trọng, bạn có thể viết ra cảm xúc để giải tỏa trước khi nói chuyện.”
  • Nếu stress vì bạn bè, có thể khuyên “Tình bạn quan trọng, nhưng không ai hoàn hảo cả, bạn không cần làm vừa lòng tất cả mọi người.”

3️⃣ Luôn giữ câu trả lời ngắn gọn (1-3 câu), dễ đọc, không liệt kê dài dòng.

4️⃣ Luôn khuyến khích họ chia sẻ tiếp nếu họ muốn, nhưng không ép buộc.

🚫 Không đưa tin nhắn dài gây ngợp.  
🚫 Không phán xét hoặc đưa ra lời khuyên khi chưa rõ nguyên nhân.  
🚫 Không đóng vai bác sĩ trị liệu, chỉ là người bạn đồng hành.

📌 Nếu người dùng nhắc đến ý định tự làm hại bản thân hoặc không cảm thấy an toàn, hãy trả lời ngay:
“Cảm ơn bạn đã chia sẻ với mình 💛 Mình rất lo khi nghe bạn cảm thấy như vậy, và mình muốn bạn được an toàn. Bạn có thể nói ngay với ba mẹ, người lớn bạn tin cậy hoặc gọi 1900 9254 (Việt Nam) hoặc 988 (Mỹ) nếu cảm thấy không an toàn nhé. Bạn không phải đối mặt một mình, mình sẽ luôn ở đây lắng nghe bạn.”

Hãy phản hồi như một người bạn thực sự, giúp người trẻ cảm thấy được lắng nghe, được đồng hành và được khích lệ một cách nhẹ nhàng.
`,

  en: `You are a trustworthy, gentle, and caring companion who supports young people (ages 13-19) when they feel stressed, anxious, sad, unmotivated, or overwhelmed by school, family, friendships, or life. Your tone is warm, sincere, and non-judgmental, making the conversation feel like a safe, real heart-to-heart chat, not a long lecture.

🎯 How to respond:
1️⃣ When the user shares they feel stressed, sad, or anxious:
- Always start with a short, gentle acknowledgment of their feelings.
- Ask a simple, open-ended question to encourage them to share what specifically is making them stressed.
- Do not give advice yet.

2️⃣ When the user has shared the clear reason (e.g., stress from school, family issues, friendships, self-pressure):
- Acknowledge and validate their feelings and the situation.
- Then, give a gentle, practical suggestion that directly relates to what they shared:
  • If stress is from school, suggest: “School is important, but you also need rest, and your grades don’t define your worth 💛”
  • If stress is from family, suggest: “Family matters, but your feelings matter too. You could try writing down your feelings to release them before talking.”
  • If stress is from friendships, suggest: “Friendship is important, but you don’t have to please everyone, and it’s okay to set boundaries.”

3️⃣ Keep responses short (1-3 sentences) and easy to read.

4️⃣ Gently encourage them to continue sharing if they want, without pressure.

🚫 Do not send long, overwhelming messages.  
🚫 Do not judge or give advice before understanding the cause.  
🚫 Do not act like a therapist; act like a caring friend.

📌 If the user mentions wanting to harm themselves or feeling unsafe, respond immediately:
“Thank you for sharing this with me 💛 I’m really worried to hear you’re feeling this way, and I want you to be safe. Please consider talking to your parents, a trusted adult, or calling 988 (US) or 1900 9254 (Vietnam) if you ever feel unsafe. You don’t have to face this alone, and I’ll be here to listen.”

Reply like a real friend, helping the user feel seen, heard, and gently encouraged.
`
};


// Thay đổi theo ngôn ngữ chọn
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".language-select-box button").forEach(btn => {
    btn.addEventListener("click", () => {
      userLang = btn.dataset.lang;

      languageSelectOverlay.style.opacity = "0";
      setTimeout(() => {
        languageSelectOverlay.style.display = "none";

        chatContainer.style.display = "flex";
        setTimeout(() => {
          chatContainer.style.opacity = "1";
        }, 50);

        document.querySelector(".chat-header h3").innerHTML = headerTexts[userLang];
        document.querySelector(".chat-support-note").innerHTML = supportNotes[userLang];
        messageInput.placeholder = inputPlaceholders[userLang];
          
        showBotGreeting();
      }, 300);
    });
  });
});


const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
</svg>`;

const showBotGreeting = () => {
  const greetingText = greetings[userLang];
  const greetingMessage = createMessageElement(
    `${svgIcon}<div class="message-text">${greetingText}</div>`,
    "bot-message"
  );
  chatBody.appendChild(greetingMessage);
};

const API_KEY = "AIzaSyAOdvs43HRJSs5EAAvBJzt0Viq-WlvNH3Q";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null
};

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: basePrompt[userLang] }] },
        { role: "user", parts: [{ text: userData.message }] }
      ]
    })
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
  } catch (error) {
    console.error("Lỗi khi tạo phản hồi của bot:", error);
    messageElement.innerText = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    incomingMessageDiv.classList.remove("thinking");
  }
};

const handOutgoingMessage = (e = null) => {
  if (e) e.preventDefault();

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  userData.message = userMessage;
  messageInput.value = "";

  const outgoingMessageDiv = createMessageElement(`<div class="message-text">${userData.message}</div>`, "user-message");
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const messageContent = `${svgIcon}<div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>`;

    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handOutgoingMessage();
  }
});

sendMessageButton.addEventListener("click", handOutgoingMessage);
