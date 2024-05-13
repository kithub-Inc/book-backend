create database book;
use book;

create table `users` (
    `node_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(20) NOT NULL UNIQUE,
    `user_name` VARCHAR(10) NOT NULL,
    `user_password` TEXT NOT NULL,
    `user_created_at` DATE DEFAULT NOW() NOT NULL
);

create table `books` (
    `node_id` INT AUTO_INCREMENT PRIMARY KEY,
    `book_name` VARCHAR(50) NOT NULL,
    `book_author` VARCHAR(20) NOT NULL
);

create table `items` (
    `node_id` INT AUTO_INCREMENT PRIMARY KEY,
    `target` INT NOT NULL,
    `item_image` TEXT,
    `item_type` VARCHAR(50) NOT NULL,
    `item_tags` VARCHAR(100),
    `item_title` VARCHAR(50) NOT NULL,
    `item_difficulty` INT NOT NULL,
    `item_qrcode` TEXT NOT NULL,
    `item_author` VARCHAR(10) NOT NULL,
    `item_created_at` DATE NOT NULL,
    `item_page` INT,
    `item_subcontent` VARCHAR(100),
    `item_content` TEXT,
    `item_index` VARCHAR(300)
);

create table `links` (
    `target` INT NOT NULL,
    `link_bookname` VARCHAR(50) NOT NULL,
    `link_content` VARCHAR(100) NOT NULL
);

insert into books (node_id, book_name, book_author) values (default, "샌즈의 이해", "ice1github");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 1, "123456789.png", "언더테일 제 1장", "#언더테일 #샌즈 #샌즈댄스", "언더테일", 3, "", "고서온", now(), 1, "언더테일 부문 최우수 수상", "와 샌즈 아시는구나! 겁.나.어.렵.습.니.다...", "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (1, "샌즈의 이해 2", "샌즈댄스 이즈");
insert into links (target, link_bookname, link_content) values (1, "만약 샌즈", "베스트 댄스");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 1, "123456789.png", "언더테일 제 10장", "#언더테일", "언더테일", 2, "", "고서온", now(), 160, "", "이것은 샌즈가 아닐 수가 없다. 왜냐하면 정말 이것은 너무 샌즈댄스가 마렵기 때문이다. 내가 샌즈댄스를 선택한 이유는 왜냐하면 새애앤즈 대애애앤스가 샌즈댄스했기 때문이다. 하지만 그것은 샌즈덕분에 댄스가 되었고 누가 샌즈댄스를 추는 바람에 나도 출 수 밖에 없었다.", "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (2, "언더팬츠", "흐! 이이잉ㅠ");
insert into links (target, link_bookname, link_content) values (2, "언더그라운드", "사과해 포이즌");

insert into books (node_id, book_name, book_author) values (default, "메렁이다 이년드라", "ice1github");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 2, "12345678910.png", "메에렁과 메에롱", "#놀림 #방법 #메롱 #메렁", "메에렁", 1, "", "고서온", now(), 124, "", "메렁이라는 것은... 메렁을 의미하면서도 그 아닌 메렁을 의미할 수 없습니다. 왜냐하면 메롱이기 때문이죠.", "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (3, "학계의 정설", "메렁");
insert into links (target, link_bookname, link_content) values (3, "스껄", "메롱");

insert into books (node_id, book_name, book_author) values (default, "전설", "ice1github");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 3, "12345678910.png", "국가의 표준", "#국가 #대한민국 #한국", "대한민국을 설명하라", 3, "", "고서온", now(), 72, "", '치중하는 2023년 건 어태커의 강조하다 금융은 대하다. 고교의 들어올, 2명, 청문회로 자칫, 식사의 진보적 평가를, 씨 시험이 모르다. "결승에 있으며 넘을 화제가 지방에 상품도 정부와 인사를 받다" 있는 작용한다 도심으로 못하다 협약으로 않다. 22일 증세에서 하나로 것 씨 별도의 수사로 온도 폐지한다. 가격을 양립할 우리를 등 지주를 않기 벌어진 친절은 인사에, 올리다. 정보로 사항부터 발상의, 뜨거워지어 증권사는 어렵은 맺다. 현행에 배출이 둘러싸이어 결과를 늘어놓아 관한지 가액에 한다.', "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (4, "페이커", "전설로 내려져");
insert into links (target, link_bookname, link_content) values (4, "뉴스", "T1 우승");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 3, "123456789.png", "국가의 표준", "#국가 #대한민국 #한국", "대한민국을 설명하라", 2, "", "고서온", now(), 16, "", '날의 어렵을 이를 엿보이는 데 온지 일월이 뇌를 기느냐 처방과 위합시다. "출입문을 의견을 이를 작은 각각, 버리다 단죄로 마인드, 교류의 발급받다" "범행이라도 챔피언에게 시대다 사태가 팽배하다" 탓이 그것을 심해지어서 관객이 당면한다 언뜻 공개로 받다. 우리와 밧줄 시월을 신장률에 정부를 심하다. 보수의 것, 별 연설이 없다 생각한, 인하고 여지를 수술까지, 있던 처리하다. 정부가 요강으로 안 편성을 일제히 탐나다 있다. 한다 질량에서 책도 높지만 밝다.', "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (5, "대설", "눈이내린 한국");
insert into links (target, link_bookname, link_content) values (5, "아", "적을거 없어");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 3, "12345678910.png", "국가의 표준", "#국가 #대한민국 #한국", "대한민국을 설명하라", 3, "", "고서온", now(), 21, "", '대통령은 콘택트를 많다 눈으로 예는 교체한 하다. "놀랍을 있어 식도의 따르어 사용한다" 갖은 세인은 영양과장을 분단은 집단을, 시장과 지금에 된 현상을 회사가 남기라. "동의하고 조치는, 그는 늘어난 막으면, 지내다" 의심보다 주지 있은 협연 2026년 컴퓨터를 쌀으로 이번에 있은 조합으로 지나다. "모니터에 업체에 이를 우려가, 물가의 차지하라 비누로 회원의 아니다"', "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (6, "뭐적지", "암거나");
insert into links (target, link_bookname, link_content) values (6, "있어보이게", "하면되겠지요");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 3, "123456789.png", "국가의 표준", "#국가 #대한민국 #한국", "대한민국을 설명하라", 3, "", "고서온", now(), 87, "", '환영하다 우위를 것, 사후는 근본주의는 것 않다. 결과가 시작되고, 속에 차량을 면담을 재난이 위원에 대비할 주변의 꿰뚫는다. 특히 자신에 리그의 해당을 탓을 왼쪽이 사다. 갖가지가 로커의, 기술에서 국산과, 포함하다. 실망하다 요구를 중요하다 대표가 조사에서 시달하다, 합치다. 따르는 것 길목을 수뇌부를 조절의, 군의 단조롭은 하다. 가장 판사다 국회에서 규정을, 암이, 불균형에 사용자의 의대를 배다 끌다. 응답을 회담은 못하고 경우나 있는, 신용은 말 남쪽일 하라.', "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (7, "흐으음", "고민하다");
insert into links (target, link_bookname, link_content) values (7, "결국", "쓰러져버린다");
insert into items (node_id, target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (default, 3, "12345678910.png", "국가의 표준", "#국가 #대한민국 #한국", "대한민국을 설명하라", 2, "", "고서온", now(), 56, "", '측 배의 아니던 검사는 대량이는 만하다 금리다 경수로가 진정하다. 두려워할 내기 현실적을 문제로 단체나 들어간다. 무너지는 보인 받게 물에 외친 이어 관련에 온다. "점 수 경제의 사라진 적극적이 병력에 그는 장교의 들어오라" 관하는 있지 특히 제적되다 피해자는 폐지하는 있다. 안기다 마땅한 사람이 아예 통합의 있는다 부지를, 하다.', "목차임. 암튼 그럼");
insert into links (target, link_bookname, link_content) values (8, "눈을 뜬", "여기는");
insert into links (target, link_bookname, link_content) values (8, "샌즈", "댄스");