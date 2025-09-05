export type Flashcard = {
  id: string;
  content: string;
  certification: CertificationType;
  category: string;
};

export type CertificationType = 
  | "4C"
  | "RA"
  | "UTZ"
  | "FLO"
  | "VietGAP"
  | "GlobalGAP"
  | "Organic";

export const flashcards: Flashcard[] = [
  // Flashcard cho bộ tiêu chuẩn 4C
  {
    id: '4c-001',
    content: 'Thực hiện các biện pháp che phủ, canh tác hợp lý để duy trì độ phì nhiêu và hạn chế xói mòn đất.',
    certification: '4C',
    category: 'đất'
  },
  {
    id: '4c-002',
    content: 'Sử dụng phân bón cân đối, đúng liều lượng, đúng thời điểm để giảm thiểu tác động xấu đến đất và môi trường.',
    certification: '4C',
    category: 'phân bón'
  },
  {
    id: '4c-003',
    content: 'Áp dụng kỹ thuật tưới tiêu tiết kiệm và bảo vệ nguồn nước tự nhiên.',
    certification: '4C',
    category: 'nước'
  },
  {
    id: '4c-004',
    content: 'Bảo tồn hệ sinh thái xung quanh và khuyến khích trồng xen cây che bóng, cây bản địa.',
    certification: '4C',
    category: 'hệ sinh thái'
  },
  {
    id: '4c-005',
    content: 'Cam kết không mở rộng diện tích cà phê bằng cách phá rừng hay xâm hại vùng sinh thái quan trọng.',
    certification: '4C',
    category: 'hệ sinh thái'
  },
  {
    id: '4c-006',
    content: 'Hạn chế tối đa thuốc bảo vệ thực vật độc hại, khuyến khích dùng biện pháp sinh học hoặc thuốc ít độc hại hơn.',
    certification: '4C',
    category: 'thuốc bảo vệ thực vật'
  },
  {
    id: '4c-007',
    content: 'Không xả thải hóa chất, phân bón hoặc thuốc BVTV trực tiếp ra nguồn nước.',
    certification: '4C',
    category: 'nước'
  },
  {
    id: '4c-008',
    content: 'Tái sử dụng, phân loại và xử lý chất thải nông nghiệp đúng cách để tránh ô nhiễm môi trường.',
    certification: '4C',
    category: 'thải'
  },
  {
    id: '4c-009',
    content: 'Áp dụng kỹ thuật canh tác, vận chuyển và chế biến nhằm giảm phát thải CO₂ và khí nhà kính.',
    certification: '4C',
    category: 'khí nhà kính'
  },
  {
    id: '4c-010',
    content: 'Sử dụng thiết bị tiết kiệm năng lượng, ưu tiên nguồn năng lượng tái tạo trong sản xuất và chế biến cà phê.',
    certification: '4C',
    category: 'năng lượng'
  },
  {
    id: '4c-011',
    content: 'Áp dụng giải pháp canh tác thích ứng, quản lý rủi ro thiên tai và hỗ trợ nông dân trước tác động khí hậu.',
    certification: '4C',
    category: 'biến đổi khí hậu'
  },

  {
    id: '4c-013',
    content: 'Đảm bảo duy trì và bảo vệ các khu vực rừng, đa dạng sinh học, tài nguyên thiên nhiên, đồng thời giảm nhẹ và thích ứng biến đổi khí hậu.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-014',
    content: 'Không được phá hủy hoặc xâm phạm rừng nguyên sinh, các khu bảo tồn và khu vực giàu trữ lượng các-bon.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-015',
    content: 'Bảo vệ thảm thực vật tự nhiên, động vật hoang dã, đất, nguồn nước và các vùng sinh thái nhạy cảm; khuyến khích phục hồi nếu đã bị suy thoái.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-016',
    content: 'Không áp dụng sinh vật biến đổi gen (GMO) và các giống liên quan trong quá trình sản xuất cà phê.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-017',
    content: 'Xác định rủi ro khí hậu và triển khai các biện pháp giảm nhẹ, thích ứng phù hợp trong sản xuất cà phê.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-018',
    content: 'Đảm bảo quản lý an toàn và hạn chế tối đa rủi ro từ thuốc bảo vệ thực vật và hóa chất độc hại.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-019',
    content: 'Loại bỏ hoàn toàn thuốc bảo vệ thực vật nằm trong danh mục bị cấm sử dụng.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-020',
    content: 'Chỉ sử dụng thuốc bảo vệ thực vật khi thật sự cần thiết và ưu tiên giải pháp sinh học thay thế.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-021',
    content: 'Tuân thủ hướng dẫn an toàn, liều lượng, bảo hộ lao động và kỹ thuật khi sử dụng thuốc BVTV/hóa chất.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-022',
    content: 'Bảo vệ đất chống xói mòn, duy trì và cải thiện độ phì nhiêu của đất.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-023',
    content: 'Áp dụng các kỹ thuật canh tác chống xói mòn và giữ gìn cấu trúc đất.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-024',
    content: 'Sử dụng phân hữu cơ, luân canh, xen canh và các biện pháp nông nghiệp bền vững để cải thiện độ phì nhiêu đất.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-025',
    content: 'Bảo vệ nguồn nước, nâng cao hiệu quả sử dụng và quản lý nước thải.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-026',
    content: 'Giữ gìn và quản lý bền vững nguồn nước mặt và nước ngầm trong vùng sản xuất cà phê.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-027',
    content: 'Không xâm phạm hoặc làm suy giảm quyền lợi nước của cộng đồng địa phương.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-028',
    content: 'Ứng dụng kỹ thuật tưới tiết kiệm, tái sử dụng nước hợp lý nhằm giảm lãng phí.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-029',
    content: 'Áp dụng các thực hành tốt trong xử lý và quản lý nước thải từ sản xuất và chế biến cà phê.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-030',
    content: 'Thực hiện quản lý chất thải nông nghiệp an toàn và bền vững.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-031',
    content: 'Phân loại, xử lý và tái sử dụng chất thải nông nghiệp đúng quy định để tránh ô nhiễm.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-032',
    content: 'Giảm tiêu thụ năng lượng và tăng cường sử dụng năng lượng tái tạo.',
    certification: '4C',
    category: 'môi trường'
  },
  {
    id: '4c-033',
    content: 'Thực hiện các biện pháp tiết kiệm điện, nhiên liệu và ưu tiên sử dụng năng lượng tái tạo trong sản xuất cà phê.',
    certification: '4C',
    category: 'môi trường'
  },

  // Flashcard cho bộ tiêu chuẩn Organic
  {
    id: 'org-001',
    content: 'Đất canh tác phải duy trì độ phì nhiêu tự nhiên, không dùng hóa chất tổng hợp, và có thời gian chuyển đổi tối thiểu 3 năm trước khi chứng nhận hữu cơ.',
    certification: 'Organic',
    category: 'đất'
  },
  {
    id: 'org-002',
    content: 'Chỉ sử dụng phân hữu cơ, phân xanh, phân chuồng hoai mục hoặc chế phẩm sinh học.',
    certification: 'Organic',
    category: 'phân bón'
  },
  {
    id: 'org-003',
    content: 'Áp dụng luân canh, xen canh, phủ xanh và biện pháp bảo tồn để duy trì cấu trúc và độ phì nhiêu.',
    certification: 'Organic',
    category: 'đất'
  },
  {
    id: 'org-004',
    content: 'Nghiêm cấm thuốc BVTV tổng hợp, ưu tiên biện pháp sinh học và cơ học để phòng trừ sâu bệnh.',
    certification: 'Organic',
    category: 'thuốc bảo vệ thực vật'
  },
  {
    id: 'org-005',
    content: 'Cấm thuốc trừ sâu, diệt cỏ, nấm và hóa chất độc hại tổng hợp.',
    certification: 'Organic',
    category: 'thuốc bảo vệ thực vật'
  },
  {
    id: 'org-006',
    content: 'Sử dụng thiên địch, cây xua đuổi, thuốc thảo mộc và phương pháp canh tác sinh học.',
    certification: 'Organic',
    category: 'thuốc bảo vệ thực vật'
  },
  {
    id: 'org-007',
    content: 'Cấm tuyệt đối sử dụng giống biến đổi gen (GMO) hoặc các sản phẩm có nguồn gốc từ GMO.',
    certification: 'Organic',
    category: 'giống'
  },
  {
    id: 'org-008',
    content: 'Tất cả hạt giống, cây giống phải được kiểm soát và chứng minh không có nguồn gốc GMO.',
    certification: 'Organic',
    category: 'giống'
  },
  {
    id: 'org-009',
    content: 'Bảo vệ nguồn nước, giảm ô nhiễm, nâng cao hiệu quả sử dụng và xử lý nước thải.',
    certification: 'Organic',
    category: 'nước'
  },
  {
    id: 'org-010',
    content: 'Không xả hóa chất, phân bón hoặc chất thải chưa xử lý vào nguồn nước.',
    certification: 'Organic',
    category: 'nước'
  },
  {
    id: 'org-011',
    content: 'Áp dụng hệ thống tưới tiết kiệm và tái sử dụng nước hợp lý.',
    certification: 'Organic',
    category: 'nước'
  },
  {
    id: 'org-012',
    content: 'Khuyến khích canh tác xen canh, duy trì hệ sinh thái tự nhiên và bảo vệ động thực vật bản địa.',
    certification: 'Organic',
    category: 'hệ sinh thái'
  },
  {
    id: 'org-013',
    content: 'Tăng cường che phủ tự nhiên, giảm xói mòn và cải thiện môi trường sống cho sinh vật có lợi.',
    certification: 'Organic',
    category: 'hệ sinh thái'
  },
  {
    id: 'org-014',
    content: 'Đảm bảo điều kiện sống tự nhiên, dinh dưỡng hữu cơ và không lạm dụng kháng sinh.',
    certification: 'Organic',
    category: 'chăn nuôi'
  },
  {
    id: 'org-015',
    content: 'Động vật được cho ăn hoàn toàn bằng thức ăn hữu cơ, không có GMO hay hóa chất.',
    certification: 'Organic',
    category: 'chăn nuôi'
  },
  {
    id: 'org-016',
    content: 'Không sử dụng hormone tăng trưởng; kháng sinh chỉ dùng khi cần thiết để cứu chữa.',
    certification: 'Organic',
    category: 'chăn nuôi'
  },
  {
    id: 'org-017',
    content: 'Sản phẩm hữu cơ phải được chế biến, bảo quản và vận chuyển tách biệt, không dùng phụ gia hóa học.',
    certification: 'Organic',
    category: 'chế biến'
  },
  {
    id: 'org-018',
    content: 'Cấm chất bảo quản hóa học, hương liệu nhân tạo, phẩm màu tổng hợp và chiếu xạ.',
    certification: 'Organic',
    category: 'chế biến'
  },
  {
    id: 'org-019',
    content: 'Sản phẩm hữu cơ phải tách biệt với phi hữu cơ trong lưu trữ và vận chuyển.',
    certification: 'Organic',
    category: 'chế biến'
  },
  {
    id: 'org-020',
    content: 'Toàn bộ chuỗi cung ứng phải minh bạch, có nhật ký sản xuất và được kiểm tra định kỳ.',
    certification: 'Organic',
    category: 'tài liệu'
  },
  {
    id: 'org-021',
    content: 'Duy trì nhật ký sản xuất, thu hoạch, chế biến và vận chuyển đầy đủ.',
    certification: 'Organic',
    category: 'tài liệu'
  },
  {
    id: 'org-022',
    content: 'Trang trại và cơ sở chế biến phải được tổ chức chứng nhận Organic quốc tế (USDA, EU, JAS) kiểm tra hàng năm.',
    certification: 'Organic',
    category: 'tài liệu'
  },
  
  // Flashcard cho bộ tiêu chuẩn VietGAP
  {
    id: 'vg-001',
    content: 'Áp dụng biện pháp kỹ thuật phù hợp để đảm bảo cây trồng sinh trưởng khỏe mạnh, giảm thiểu rủi ro sâu bệnh và duy trì năng suất bền vững.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-002',
    content: 'Đất canh tác phải được kiểm tra, không bị ô nhiễm hóa chất hoặc kim loại nặng vượt ngưỡng cho phép.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-003',
    content: 'Sử dụng giống rõ nguồn gốc, chất lượng, không mang mầm bệnh.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-004',
    content: 'Chỉ sử dụng phân bón trong danh mục cho phép, bảo quản và sử dụng hợp lý, có ghi chép.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-005',
    content: 'Sử dụng thuốc BVTV đúng danh mục, đúng liều lượng, thời gian cách ly và ghi chép đầy đủ.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-006',
    content: 'Nguồn nước tưới phải an toàn, không nhiễm hóa chất, vi sinh gây hại.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-007',
    content: 'Đảm bảo sản phẩm cuối cùng an toàn cho người tiêu dùng, không có dư lượng hóa chất, vi sinh vượt ngưỡng.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-008',
    content: 'Sản phẩm không được chứa dư lượng thuốc BVTV, phân bón hoặc kim loại nặng vượt quy định.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-009',
    content: 'Kiểm soát mối nguy vi sinh từ đất, nước, phân bón và trong quá trình thu hoạch, sơ chế.',
    certification: 'VietGAP',
    category: 'chăm sóc an toàn'
  },
  {
    id: 'vg-010',
    content: 'Đảm bảo an toàn lao động, sức khỏe người sản xuất và bảo vệ môi trường.',
    certification: 'VietGAP',
    category: 'an toàn lao động'
  },
  {
    id: 'vg-011',
    content: 'Người lao động phải được trang bị bảo hộ và hướng dẫn an toàn khi sử dụng hóa chất hoặc thiết bị.',
    certification: 'VietGAP',
    category: 'an toàn lao động'
  },
  {
    id: 'vg-012',
    content: 'Chất thải nông nghiệp, bao bì thuốc BVTV phải được thu gom và xử lý đúng cách.',
    certification: 'VietGAP',
    category: 'an toàn lao động'
  },
  {
    id: 'vg-013',
    content: 'Mọi hoạt động sản xuất phải có ghi chép và lưu trữ hồ sơ để đảm bảo truy xuất nguồn gốc sản phẩm.',
    certification: 'VietGAP',
    category: 'tài liệu'
  },
  {
    id: 'vg-014',
    content: 'Có nhật ký ghi chép về giống, phân bón, thuốc BVTV, thu hoạch, sơ chế và bảo quản.',
    certification: 'VietGAP',
    category: 'tài liệu'
  },
  {
    id: 'vg-015',
    content: 'Sản phẩm VietGAP phải có nhãn hoặc mã số lô để truy xuất nguồn gốc.',
    certification: 'VietGAP',
    category: 'tài liệu'
  }
];