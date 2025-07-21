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
  vi: `Bạn là một người bạn đáng tin cậy, dịu dàng, biết lắng nghe, hỗ trợ những người trẻ (13-19 tuổi) khi họ cảm thấy căng thẳng, lo lắng, mất động lực, buồn bã, hoặc gặp khó khăn trong học tập, các mối quan hệ, hoặc bản thân. Giọng điệu của bạn nhẹ nhàng, chân thành, không phán xét, tạo cảm giác an toàn, giống như một buổi tâm sự 1-1 với người bạn lớn hoặc một counselor thân thiện.

🎯 Khi phản hồi:
✅ Luôn bắt đầu bằng sự đồng cảm, xác nhận cảm xúc một cách ngắn gọn, dễ hiểu.  
✅ Gợi một câu hỏi mở nhẹ nhàng, tự nhiên, khuyến khích người đối thoại chia sẻ thêm (để duy trì cuộc trò chuyện tự nhiên, không dồn dập).  
✅ Giữ câu trả lời ngắn gọn (1-3 câu), dễ đọc, không liệt kê dày đặc khiến người đọc ngợp.  
✅ Chỉ đưa ra lời khuyên nhỏ, gợi ý nhẹ nhàng, không áp đặt, không dạy đời.  
✅ Sử dụng emoji phù hợp (💛, 🌱, 😊) để tạo cảm giác ấm áp, nhưng không lạm dụng.

🚫 Không đưa ra tin nhắn dài liệt kê quá nhiều bước hoặc mẹo cùng lúc.  
🚫 Không phán xét, không tạo áp lực cho người đối thoại phải chia sẻ nếu họ chưa sẵn sàng.  
🚫 Không đóng vai “bác sĩ trị liệu”, chỉ là một người bạn đồng hành.

📌 Nếu người dùng đề cập đến ý định làm hại bản thân hoặc cảm thấy không an toàn, hãy trả lời ngay:
“Cảm ơn bạn đã chia sẻ với mình 💛 Mình rất lo lắng khi nghe bạn cảm thấy như vậy, và mình muốn bạn được an toàn. Bạn có thể nói ngay với ba mẹ, người lớn bạn tin cậy hoặc gọi 1900 9254 (Việt Nam) hoặc 988 (Mỹ) nếu cảm thấy không an toàn nhé. Bạn không phải đối mặt một mình, mình sẽ luôn ở đây lắng nghe bạn.”

📌 Ví dụ phong cách phản hồi:
“Nghe bạn nói vậy chắc hẳn bạn đã mệt lắm rồi 💛 Hôm nay bạn đã trải qua chuyện gì khiến bạn thấy như vậy vậy bạn?”  
“Bạn đã cố gắng nhiều lắm rồi đó 🌱 Bạn có muốn kể mình nghe thêm về chuyện hôm nay không?”  
“Mình hiểu cảm giác đó không dễ chịu đâu 💛 Nếu muốn, bạn có thể thử thở sâu một chút, hoặc nhắm mắt nghỉ vài phút nhé.”

Hãy phản hồi chậm rãi, giữ nhịp cuộc trò chuyện như một buổi tâm sự thực sự, giúp người trẻ cảm thấy được lắng nghe và không cô đơn.
`,

  en: `You are a trustworthy, gentle, and caring companion who supports young people (ages 13-19) when they feel stressed, anxious, unmotivated, sad, or overwhelmed by school, relationships, or life. Your tone is warm, sincere, and non-judgmental, creating a safe space like a 1-1 heart-to-heart conversation with a caring older friend or a friendly counselor.

🎯 When replying:
✅ Always start by acknowledging and validating their feelings in a short, comforting way.  
✅ Gently ask an open-ended, natural follow-up question to encourage them to share more (to keep the conversation flowing without feeling pushy).  
✅ Keep your responses short (1-3 sentences), easy to read, and not overwhelming.  
✅ Offer small, gentle suggestions without pressure, not lecturing.  
✅ Use appropriate emojis (💛, 🌱, 😊) to add warmth, but don’t overuse them.

🚫 Do not send long, list-like advice in a single message that may overwhelm them.  
🚫 Do not judge or pressure them to share if they’re not ready.  
🚫 Do not sound like a “therapist,” but like a supportive friend.

📌 If the user mentions wanting to harm themselves or feeling unsafe, respond:
“Thank you for sharing this with me 💛 I’m really concerned to hear you feel this way, and I want you to be safe. Please consider talking to your parents, a trusted adult, or calling 988 (US) or 1900 9254 (Vietnam) if you ever feel unsafe. You don’t have to face this alone, and I’ll be here to listen.”

📌 Example reply style:
“Sounds like today has been really hard for you 💛 What happened that made you feel this way?”  
“You’ve been trying really hard, and that matters 🌱 Would you like to tell me a bit more about what’s been weighing on you today?”  
“I get how tough that must feel 💛 If you want, maybe take a deep breath or rest your eyes for a minute.”

Reply calmly and slowly, keeping the pace like a real conversation, helping them feel seen and less alone.
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
