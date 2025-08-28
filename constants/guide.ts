export type GuideItem = {
  id: string;
  title: string;
  window: string;
  desc?: string;
};
export type GuideYear = {
  year: 1 | 2 | 3;
  sections: { name: string; items: GuideItem[] }[];
};

export const GUIDE_YEARS: GuideYear[] = [
  {
    year: 1,
    sections: [
      {
        name: "Chuẩn bị đất & quy hoạch",
        items: [
          {
            id: "y1-01",
            title: "Làm đất, cày ải 30–40cm",
            window: "Khoảng 20/8",
            desc: "Dọn sạch cỏ dại, rễ cây không cần thiết.",
          },
          {
            id: "y1-02",
            title: "Quy hoạch đường nội bộ",
            window: "Cuối 8",
            desc: "Thiết kế lối chăm sóc, thu hoạch.",
          },
          {
            id: "y1-03",
            title: "Cắm tiêu, rải vôi; đào hố",
            window: "Cuối 8",
            desc: "Khoảng cách 3.0m × 1.5m, hố thoát nước tốt.",
          },
        ],
      },
      {
        name: "Tưới & trồng mới",
        items: [
          {
            id: "y1-04",
            title: "Lắp tưới tự động, trải hồ bạt",
            window: "Đầu 9",
            desc: "Tính lưu lượng, áp lực; tối ưu tuyến ống.",
          },
          {
            id: "y1-05",
            title: "Bón lót",
            window: "Cuối 9",
            desc: "Phân gà nở ~0.5kg/gốc, trộn đều.",
          },
          {
            id: "y1-06",
            title: "Trồng cây giống",
            window: "Cuối 9",
            desc: "Chọn giống Xanh Lùn/Thiện Trường, cây khỏe.",
          },
          {
            id: "y1-07",
            title: "Thuốc sâu gốc",
            window: "Ngay sau trồng",
            desc: "Định mức ~1kg/200 gốc.",
          },
        ],
      },
      {
        name: "Chăm sóc năm 1",
        items: [
          {
            id: "y1-08",
            title: "Phun sâu/nấm định kỳ",
            window: "Hàng tháng",
            desc: "1 lần/tháng toàn vườn.",
          },
          {
            id: "y1-09",
            title: "Cắt cỏ định kỳ",
            window: "4 lần/năm",
            desc: "Giữ thảm cỏ thấp, hạn chế cỏ cạnh tranh.",
          },
          {
            id: "y1-10",
            title: "Bón phân combo",
            window: "Theo lịch dinh dưỡng",
            desc: "≈45tr/ha/năm.",
          },
          {
            id: "y1-11",
            title: "Vận hành tưới",
            window: "Theo ẩm độ đất",
            desc: "Theo dõi ẩm, điều chỉnh chu kỳ.",
          },
          {
            id: "y1-12",
            title: "Theo dõi sinh trưởng",
            window: "Hàng quý",
            desc: "Ghi chiều cao, đường kính tán.",
          },
        ],
      },
    ],
  },
  {
    year: 2,
    sections: [
      {
        name: "Dinh dưỡng & bảo vệ",
        items: [
          {
            id: "y2-01",
            title: "Bón phân combo",
            window: "Theo vụ",
            desc: "≈50tr/ha/năm.",
          },
          {
            id: "y2-02",
            title: "Phun sâu/nấm",
            window: "Hàng tháng",
            desc: "Che phủ đều tán.",
          },
          {
            id: "y2-03",
            title: "Cắt cỏ",
            window: "1–2 lần/năm",
            desc: "Giữ mặt đất thông thoáng.",
          },
        ],
      },
      {
        name: "Nước & quản lý",
        items: [
          {
            id: "y2-04",
            title: "Tưới, nhiên liệu/điện",
            window: "Theo mùa khô",
            desc: "Tối ưu chi phí tưới.",
          },
          {
            id: "y2-05",
            title: "Quản lý lao động",
            window: "Hàng tháng",
            desc: "Lịch công, an toàn lao động.",
          },
        ],
      },
      {
        name: "Thu hoạch & chế biến",
        items: [
          {
            id: "y2-06",
            title: "Dự trù sản lượng ~4kg tươi/cây",
            window: "Mùa thu–đông",
            desc: "Ước ~8.8 tấn/ha.",
          },
          {
            id: "y2-07",
            title: "Tổ chức hái, vận chuyển",
            window: "Theo đợt chín",
            desc: "Chi phí ~1.000đ/kg tươi.",
          },
          {
            id: "y2-08",
            title: "Sơ chế, phơi/sấy",
            window: "Ngay sau hái",
            desc: "Mục tiêu chất lượng ổn định.",
          },
        ],
      },
    ],
  },
  {
    year: 3,
    sections: [
      {
        name: "Dinh dưỡng & BVTV",
        items: [
          {
            id: "y3-01",
            title: "Bón phân combo",
            window: "Theo vụ",
            desc: "≈80tr/ha/năm.",
          },
          {
            id: "y3-02",
            title: "Phun sâu bệnh",
            window: "Hàng tháng",
            desc: "Theo dõi dịch hại.",
          },
          {
            id: "y3-03",
            title: "Cắt cỏ",
            window: "4 lần/năm",
            desc: "Hạn chế cỏ cạnh tranh.",
          },
        ],
      },
      {
        name: "Nước & quản lý",
        items: [
          {
            id: "y3-04",
            title: "Tưới, nhiên liệu/điện",
            window: "Theo mùa khô",
            desc: "Tối ưu suất tưới.",
          },
          {
            id: "y3-05",
            title: "Quản lý lao động",
            window: "Hàng tháng",
            desc: "Kế hoạch thu hoạch lớn.",
          },
        ],
      },
      {
        name: "Thu hoạch & doanh thu",
        items: [
          {
            id: "y3-06",
            title: "Dự trù ~15kg tươi/cây",
            window: "Mùa thu–đông",
            desc: "≈198 tấn tươi/6ha.",
          },
          {
            id: "y3-07",
            title: "Hái, chế biến, bán hàng",
            window: "Theo lịch chín",
            desc: "Chuẩn hóa quy trình.",
          },
        ],
      },
    ],
  },
];
