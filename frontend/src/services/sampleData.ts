import { KdWord, KdWordType } from '../types';

export const SAMPLE_WORD_TYPES: KdWordType[] = [
  { id: 1, code: 'd', name_vi: 'Danh từ', description: 'Từ chỉ người, sự vật, con vật, hiện tượng thiên nhiên' },
  { id: 2, code: 'đ', name_vi: 'Động từ', description: 'Từ chỉ hành động, trạng thái' },
  { id: 3, code: 't', name_vi: 'Tính từ', description: 'Từ chỉ tính chất, màu sắc, đặc điểm' },
  { id: 4, code: 'đt', name_vi: 'Đại từ', description: 'Từ dùng để xưng hô, chỉ định' },
  { id: 5, code: 'pt', name_vi: 'Phụ từ', description: 'Từ bổ trợ ý nghĩa' },
];

export const INITIAL_WORDS: KdWord[] = [
  {
    id: 'word-1',
    word_koho: 'Bơr',
    phonetic: '/bər/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Cơm; bữa ăn; lương thực',
    definition_vi: 'Lương thực chính nấu từ hạt thóc nương của đồng bào K\'Ho',
    notes: 'Biểu tượng của sự no đủ, sum vầy trong gia đình người K\'Ho',
    status: 'APPROVED',
    view_count: 128,
    phrases: [
      {
        id: 'p-1',
        phrase_koho: 'Bơr sa',
        phonetic: '/bər sa/',
        meaning_vi: 'Bữa cơm hàng ngày; việc ăn uống',
        explanation_vi: 'Dùng để gọi các thành viên trong gia đình vào bàn ăn',
      },
      {
        id: 'p-2',
        phrase_koho: 'Bơr tàm lăm',
        phonetic: '/bər tam lam/',
        meaning_vi: 'Cơm lam nướng ống nứa',
        explanation_vi: 'Món ăn đặc sản truyền thống của người K\'Ho khi đi rừng hoặc lễ hội',
      },
    ],
    examples: [
      {
        id: 'ex-1',
        sentence_koho: 'He lơh sa bơr bal mờ bu bòn!',
        sentence_vi: 'Chúng ta cùng ăn cơm sum vầy với buôn làng nào!',
      },
    ],
  },
  {
    id: 'word-2',
    word_koho: 'Đa',
    phonetic: '/ɗaː/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Nước; dòng nước; sông suối',
    definition_vi: 'Chất lỏng tự nhiên quý giá, khởi nguồn của sự sống muôn loài',
    notes: 'Rất phổ biến trong các địa danh Tây Nguyên (Đa Nhim, Đa Lạch, Đa Huoai)',
    status: 'APPROVED',
    view_count: 240,
    phrases: [
      {
        id: 'p-3',
        phrase_koho: 'Đa dêr',
        phonetic: '/ɗaː ɗeːr/',
        meaning_vi: 'Dòng suối nhỏ trong rừng',
        explanation_vi: 'Con suối mát trong chảy từ khe đá',
      },
      {
        id: 'p-4',
        phrase_koho: 'Đa kloh',
        phonetic: '/ɗaː klɔh/',
        meaning_vi: 'Nước trong vắt, nước sạch',
        explanation_vi: 'Nguồn nước có thể uống trực tiếp',
      },
    ],
    examples: [
      {
        id: 'ex-2',
        sentence_koho: 'Kòn đơs mờ da kloh tàm bơnơm.',
        sentence_vi: 'Trẻ nhỏ nô đùa tắm bên dòng nước mát trong núi.',
      },
    ],
  },
  {
    id: 'word-3',
    word_koho: 'Bơnơm',
    phonetic: '/bəˈnəm/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Núi; đồi cao; đỉnh núi',
    definition_vi: 'Vùng đồi núi cao nguyên hiểm trở, quê hương ngàn đời của người K\'Ho',
    notes: 'Gắn liền với rặng núi huyền thoại Lang Biang',
    status: 'APPROVED',
    view_count: 95,
    phrases: [
      {
        id: 'p-5',
        phrase_koho: 'Bơnơm Lang Biang',
        phonetic: '/bəˈnəm laːŋ biːəŋ/',
        meaning_vi: 'Đỉnh núi Lang Biang huyền thoại',
        explanation_vi: 'Biểu tượng tình yêu vĩnh hằng của chàng K\'Lang và nàng H\'Biang',
      },
    ],
    examples: [
      {
        id: 'ex-3',
        sentence_koho: 'Bơnơm Lang Biang gơtùi kơ đờng ngăn.',
        sentence_vi: 'Núi Lang Biang sừng sững cao vút giữa mây trời.',
      },
    ],
  },
  {
    id: 'word-4',
    word_koho: 'Liam',
    phonetic: '/liːəm/',
    word_type: SAMPLE_WORD_TYPES[2],
    meaning_vi: 'Đẹp; duyên dáng; tốt lành',
    definition_vi: 'Từ khen ngợi vẻ đẹp ngoại hình, tính cách hoặc cảnh quan thiên nhiên',
    status: 'APPROVED',
    view_count: 310,
    phrases: [
      {
        id: 'p-6',
        phrase_koho: 'Oh liam',
        phonetic: '/ɔh liːəm/',
        meaning_vi: 'Người em gái xinh đẹp',
        explanation_vi: 'Cách gọi trìu mến dành cho người yêu hoặc thiếu nữ K\'Ho',
      },
    ],
    examples: [
      {
        id: 'ex-4',
        sentence_koho: 'Trang phục thổ cẩm K\'Ho liam ngăn!',
        sentence_vi: 'Trang phục thổ cẩm của người K\'Ho trông thật đẹp rực rỡ!',
      },
    ],
  },
  {
    id: 'word-5',
    word_koho: 'Sa',
    phonetic: '/saː/',
    word_type: SAMPLE_WORD_TYPES[1],
    meaning_vi: 'Ăn; dùng bữa',
    definition_vi: 'Hành động ăn uống hàng ngày',
    status: 'APPROVED',
    view_count: 75,
    phrases: [
      {
        id: 'p-7',
        phrase_koho: 'Sa nhơm',
        phonetic: '/saː ɲəm/',
        meaning_vi: 'Ăn rau rừng',
        explanation_vi: 'Các loại rau dại hái trên nương rẫy',
      },
    ],
    examples: [
      {
        id: 'ex-5',
        sentence_koho: 'He sa bơr mờ nhơm bòn.',
        sentence_vi: 'Chúng ta ăn cơm với rau nương.',
      },
    ],
  },
  {
    id: 'word-6',
    word_koho: 'Mi',
    phonetic: '/miː/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Mưa; cơn mưa rừng',
    definition_vi: 'Hiện tượng nước rơi từ mây trời mang lại mùa màng tươi tốt',
    status: 'APPROVED',
    view_count: 89,
    phrases: [
      {
        id: 'p-8',
        phrase_koho: 'Mi đờng',
        phonetic: '/miː ɗəŋ/',
        meaning_vi: 'Mưa rào lớn',
        explanation_vi: 'Cơn mưa to đầu mùa tưới mát rẫy bắp',
      },
    ],
    examples: [
      {
        id: 'ex-6',
        sentence_koho: 'Mi tus bơh măt tơngai.',
        sentence_vi: 'Cơn mưa rừng đổ xuống lúc hoàng hôn.',
      },
    ],
  },
  {
    id: 'word-7',
    word_koho: 'Mat tơngai',
    phonetic: '/mat təˈŋaːi/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Mặt trời; vầng thái dương',
    definition_vi: 'Nguồn ánh sáng ấm áp nuôi dưỡng vạn vật',
    status: 'APPROVED',
    view_count: 142,
    phrases: [],
    examples: [
      {
        id: 'ex-7',
        sentence_koho: 'Mat tơngai lơh tàm bơnơm.',
        sentence_vi: 'Mặt trời ló rạng trên đỉnh núi cao.',
      },
    ],
  },
  {
    id: 'word-8',
    word_koho: 'Bòn',
    phonetic: '/bɔn/',
    word_type: SAMPLE_WORD_TYPES[0],
    meaning_vi: 'Buôn làng; cộng đồng thôn bản',
    definition_vi: 'Đơn vị cư trú truyền thống của đồng bào người K\'Ho',
    status: 'APPROVED',
    view_count: 168,
    phrases: [
      {
        id: 'p-9',
        phrase_koho: 'Kuang bòn',
        phonetic: '/kuːaŋ bɔn/',
        meaning_vi: 'Trưởng buôn; già làng',
        explanation_vi: 'Người cao tuổi có uy tín và tiếng nói đứng đầu buôn làng K\'Ho',
      },
    ],
    examples: [
      {
        id: 'ex-8',
        sentence_koho: 'Kuang bòn sơng gơr mờ bơnđơn.',
        sentence_vi: 'Già làng căn dặn con cháu giữ gìn nét văn hóa cha ông.',
      },
    ],
  },
];
