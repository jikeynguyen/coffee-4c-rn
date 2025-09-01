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

// ==== Đầu vào để dựng guide ====
export type BuildParams = {
  crop: "robusta" | "arabica";
  variety: string; // tên giống hiển thị
  plantingMonth: number; // 1..12
  soilTexture: "sand" | "loam" | "clay";
  ph: number;
  annualRain_mm: number;
  tmean_c: number;
  rh_pct?: number;
  certifications: (
    | "4C"
    | "RA"
    | "UTZ"
    | "FLO"
    | "VietGAP"
    | "GlobalGAP"
    | "Organic"
  )[];
};

// ==== Tiện ích lịch ====
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const wrapMonth = (m: number) => {
  const x = (((m - 1) % 12) + 12) % 12; // 0..11
  return x + 1; // 1..12
};
const mLabel = (m: number) => `Tháng ${wrapMonth(m)}`;
const phase = (p: "early" | "mid" | "late") =>
  p === "early" ? "Đầu" : p === "mid" ? "Giữa" : "Cuối";
const win = (p: "early" | "mid" | "late", m: number) =>
  `${phase(p)} ${mLabel(m)}`;

// ==== Quy tắc đơn giản cho prototype ====
function rainClass(mm: number): "dry" | "mid" | "wet" {
  if (mm < 1200) return "dry";
  if (mm <= 1800) return "mid";
  return "wet";
}
function targetPh(crop: BuildParams["crop"]) {
  return crop === "robusta" ? 5.5 : 6.0;
}
function limeNeedKgPerHa(crop: BuildParams["crop"], ph: number) {
  const deficit = targetPh(crop) - ph;
  if (deficit <= 0) return 0;
  return Math.ceil((deficit / 0.5) * 500); // 500 kg/ha cho mỗi 0.5 pH thiếu
}
function isOrganic(certs: BuildParams["certifications"]) {
  return certs.includes("Organic");
}
function has(
  certs: BuildParams["certifications"],
  key: BuildParams["certifications"][number]
) {
  return certs.includes(key);
}

// ==== Dựng checklist tuân thủ theo chứng nhận (ưu tiên, rải ở Năm 1) ====
function complianceItems(certs: BuildParams["certifications"]): GuideItem[] {
  const items: GuideItem[] = [];
  if (has(certs, "4C")) {
    items.push(
      {
        id: "c-4c-forest",
        title: "4C: Không phá rừng/khu bảo tồn",
        window: "Ngay khi khởi tạo",
      },
      {
        id: "c-4c-ppe",
        title: "4C: PPE & an toàn lao động",
        window: "Trước khi phun/tưới",
      },
      {
        id: "c-4c-record",
        title: "4C: Sổ ghi chép/nhật ký sản xuất",
        window: "Từ Năm 1, liên tục",
      },
      {
        id: "c-4c-waste",
        title: "4C: Thu gom bao bì, chất thải đúng quy định",
        window: "Mỗi lần sử dụng",
      }
    );
  }
  if (has(certs, "RA")) {
    items.push(
      {
        id: "c-ra-ipm",
        title: "RA: IPM, giảm thuốc độc hại",
        window: "Ngay khi khởi tạo",
        desc: "Bẫy, dầu khoáng, nấm xanh; ưu tiên sinh học",
      },
      {
        id: "c-ra-banned",
        title: "RA: Không dùng hoạt chất bị cấm",
        window: "Trước khi mua vật tư",
      },
      {
        id: "c-ra-trace",
        title: "RA: Truy xuất & mã lô",
        window: "Từ Năm 1, liên tục",
      }
    );
  }
  if (has(certs, "UTZ")) {
    items.push(
      {
        id: "c-utz-plan",
        title: "UTZ: Kế hoạch quản lý nông trại",
        window: "Ngay khi khởi tạo",
      },
      {
        id: "c-utz-training",
        title: "UTZ: Hồ sơ đào tạo an toàn/kỹ thuật",
        window: "Trong Năm 1",
      },
      {
        id: "c-utz-internal",
        title: "UTZ: Tự đánh giá nội bộ định kỳ",
        window: "6–12 tháng/lần",
      }
    );
  }
  if (has(certs, "FLO")) {
    items.push(
      {
        id: "c-flo-nochild",
        title: "FLO: Không lao động trẻ em/cưỡng bức",
        window: "Ngay khi khởi tạo",
      },
      {
        id: "c-flo-premium",
        title: "FLO: Quản lý Quỹ Premium minh bạch",
        window: "Hàng năm",
      }
    );
  }
  if (has(certs, "VietGAP")) {
    items.push(
      {
        id: "c-vg-log",
        title: "VietGAP: Nhật ký vật tư, tưới, phun, thu hoạch",
        window: "Từ Năm 1, liên tục",
      },
      {
        id: "c-vg-phi",
        title: "VietGAP: Tuân thủ thời gian cách ly (PHI)",
        window: "Trước thu hoạch mỗi đợt",
      },
      {
        id: "c-vg-trace",
        title: "VietGAP: Mã lô & truy xuất",
        window: "Từ Năm 1, liên tục",
      }
    );
  }
  if (has(certs, "GlobalGAP")) {
    items.push(
      {
        id: "c-gg-mrl",
        title: "GlobalG.A.P.: Hồ sơ phun & MRL/PHI",
        window: "Mỗi lần phun",
      },
      {
        id: "c-gg-calib",
        title: "GlobalG.A.P.: Hiệu chuẩn thiết bị phun/đo",
        window: "Hàng năm",
      },
      {
        id: "c-gg-recall",
        title: "GlobalG.A.P.: Kế hoạch truy xuất & thu hồi",
        window: "Ngay khi khởi tạo",
      }
    );
  }
  if (isOrganic(certs)) {
    items.push(
      {
        id: "c-org-nosyn",
        title: "Organic: Không dùng phân/thuốc tổng hợp",
        window: "Từ Năm 1, liên tục",
      },
      {
        id: "c-org-buffer",
        title: "Organic: Vùng đệm & tách biệt",
        window: "Ngay khi khởi tạo",
      },
      {
        id: "c-org-conv",
        title: "Organic: Ghi nhận thời gian chuyển đổi",
        window: "Năm 1",
      }
    );
  }
  return items;
}

// ==== Hàm chính ====
export function buildGuide(params: BuildParams): GuideYear[] {
  const P = params;
  const rain = rainClass(P.annualRain_mm);
  const limeKg = limeNeedKgPerHa(P.crop, P.ph);
  const needLime = limeKg > 0;
  const org = isOrganic(P.certifications);

  const mPrep = wrapMonth(P.plantingMonth - 1);
  const mPlant = wrapMonth(P.plantingMonth);
  const mIrr = rain === "dry" ? wrapMonth(P.plantingMonth - 1) : mPlant;

  const y1_prepare: GuideItem[] = [
    {
      id: "y1-01",
      title: "Làm đất, cày ải 30–40cm",
      window: win("mid", mPrep),
      desc: "Dọn cỏ dại, xử lý rễ cây không cần thiết",
    },
    {
      id: "y1-02",
      title: "Quy hoạch đường nội bộ",
      window: win("late", mPrep),
      desc: "Bố trí lối chăm sóc, thu hoạch và thoát nước",
    },
    {
      id: "y1-03",
      title: "Cắm tiêu, đào hố",
      window: win("late", mPrep),
      desc: "Khoảng cách khuyến nghị theo mật độ; hố thoát nước tốt",
    },
  ];
  if (needLime) {
    y1_prepare.push({
      id: "y1-03a",
      title: `Rải vôi cải tạo pH (~${limeKg} kg/ha)`,
      window: win("late", mPrep),
      desc: `pH hiện tại ${P.ph} < mục tiêu ${targetPh(P.crop)}; rải trước bón lót 2–3 tuần`,
    });
  }

  const y1_irrigate_plant: GuideItem[] = [
    {
      id: "y1-04",
      title: "Lắp hệ thống tưới",
      window: win("early", mIrr),
      desc:
        rain === "dry"
          ? "Ưu tiên béc/nhỏ giọt, tính lưu lượng & áp lực mùa khô"
          : "Tối ưu tuyến ống và nguồn cấp",
    },
    {
      id: "y1-05",
      title: "Bón lót hố trồng",
      window: win("mid", mPlant),
      desc: "Phân chuồng hoai/vi sinh, trộn đều, lấp đất mịn",
    },
    {
      id: "y1-06",
      title: `Trồng cây giống (${P.variety})`,
      window: win("late", mPlant),
      desc: "Chọn cây khỏe, không sâu bệnh, đảm bảo độ ẩm sau trồng",
    },
    org
      ? {
          id: "y1-07-org",
          title: "Bảo vệ gốc sinh học",
          window: "Ngay sau trồng",
          desc: "Nấm đối kháng, neem/dầu khoáng; không dùng hóa chất tổng hợp",
        }
      : {
          id: "y1-07",
          title: "Thuốc sâu gốc",
          window: "Ngay sau trồng",
          desc: "Định mức tham chiếu ~1kg/200 gốc, theo nhãn thuốc và an toàn",
        },
  ];

  const ipmTitle = org
    ? "IPM sinh học, không thuốc tổng hợp"
    : "Phun sâu/nấm định kỳ";
  const ipmDesc = org
    ? "Bẫy dính, tỉa tán, nấm xanh; ưu tiên chế phẩm sinh học"
    : "1 lần/tháng, luân phiên hoạt chất, tuân thủ nhãn & PHI";
  const y1_care: GuideItem[] = [
    { id: "y1-08", title: ipmTitle, window: "Hàng tháng", desc: ipmDesc },
    {
      id: "y1-09",
      title: "Cắt cỏ định kỳ",
      window: rain === "wet" ? "3–4 lần/năm" : "4–5 lần/năm",
      desc: "Giữ thảm sống thấp, hạn chế cạnh tranh dinh dưỡng",
    },
    {
      id: "y1-10",
      title: "Bón phân theo nhu cầu đất",
      window: "Theo lịch dinh dưỡng",
      desc:
        P.soilTexture === "sand"
          ? "Đất cát: chia nhỏ lần bón, tăng hữu cơ"
          : P.soilTexture === "clay"
            ? "Đất sét: chú ý thoát nước, tránh úng"
            : "Đất thịt: cân đối N-P-K + hữu cơ",
    },
    {
      id: "y1-11",
      title: "Vận hành tưới",
      window: "Theo ẩm độ đất",
      desc: "Điều chỉnh chu kỳ theo mùa và mưa",
    },
    {
      id: "y1-12",
      title: "Theo dõi sinh trưởng",
      window: "Hàng quý",
      desc: "Ghi chiều cao, đường kính tán, tỷ lệ sống",
    },
  ];

  const y1_compliance: GuideItem[] = complianceItems(P.certifications);

  const y2_nutri_protect: GuideItem[] = [
    {
      id: "y2-01",
      title: "Bón phân theo vụ",
      window: "Theo vụ",
      desc: "Điều chỉnh theo pH và kết cấu đất",
    },
    {
      id: "y2-02",
      title: org ? "IPM sinh học" : "Phun sâu/nấm",
      window: "Hàng tháng",
      desc: org
        ? "Bẫy, dầu khoáng, sinh học; ghi chép đầy đủ"
        : "Che phủ đều tán, tuân thủ luân phiên hoạt chất",
    },
    {
      id: "y2-03",
      title: "Cắt cỏ",
      window: rain === "wet" ? "2–3 lần/năm" : "1–2 lần/năm",
      desc: "Giữ mặt đất thông thoáng",
    },
  ];
  const y2_water_mgmt: GuideItem[] = [
    {
      id: "y2-04",
      title: "Tưới, nhiên liệu/điện",
      window: "Theo mùa khô",
      desc: "Tối ưu chi phí tưới",
    },
    {
      id: "y2-05",
      title: "Quản lý lao động & an toàn",
      window: "Hàng tháng",
      desc: "Kế hoạch công việc, PPE đầy đủ",
    },
  ];
  const y2_harvest: GuideItem[] = [
    {
      id: "y2-06",
      title: "Dự trù sản lượng năm 2",
      window: "Mùa thu–đông",
      desc: "~4 kg tươi/cây (tham chiếu)",
    },
    {
      id: "y2-07",
      title: "Tổ chức hái, vận chuyển",
      window: "Theo đợt chín",
      desc: "Chi phí tham chiếu ~1.000đ/kg tươi; chọn quả chín",
    },
    {
      id: "y2-08",
      title: "Sơ chế, phơi/sấy",
      window: "Ngay sau hái",
      desc: "Đảm bảo vệ sinh, truy xuất mẻ",
    },
  ];

  // Bổ sung hạng mục chứng nhận theo chu kỳ hàng năm (GlobalGAP/VietGAP/RA)
  const y2_complianceExtra: GuideItem[] = [];
  if (has(P.certifications, "GlobalGAP"))
    y2_complianceExtra.push({
      id: "y2-gg-calib",
      title: "GlobalG.A.P.: Hiệu chuẩn thiết bị",
      window: "Hàng năm",
    });
  if (has(P.certifications, "VietGAP"))
    y2_complianceExtra.push({
      id: "y2-vg-internal",
      title: "VietGAP: Tự đánh giá nội bộ",
      window: "Hàng năm",
    });
  if (has(P.certifications, "RA"))
    y2_complianceExtra.push({
      id: "y2-ra-review",
      title: "RA: Rà soát IPM & danh mục cấm",
      window: "Trước mùa mưa",
    });

  const y3_nutri_bvtv: GuideItem[] = [
    {
      id: "y3-01",
      title: "Bón phân theo vụ",
      window: "Theo vụ",
      desc: "Tối ưu theo năng suất mục tiêu",
    },
    {
      id: "y3-02",
      title: org ? "IPM sinh học" : "Phun sâu bệnh",
      window: "Hàng tháng",
      desc: org
        ? "Không thuốc tổng hợp; tăng cường biện pháp canh tác"
        : "Theo dõi dịch hại, MRL/PHI",
    },
    {
      id: "y3-03",
      title: "Cắt cỏ",
      window: rain === "wet" ? "3–4 lần/năm" : "4 lần/năm",
      desc: "Hạn chế cạnh tranh dinh dưỡng",
    },
  ];
  const y3_water_mgmt: GuideItem[] = [
    {
      id: "y3-04",
      title: "Tưới, nhiên liệu/điện",
      window: "Theo mùa khô",
      desc: "Kiểm tra lưu lượng, áp lực",
    },
    {
      id: "y3-05",
      title: "Quản lý lao động",
      window: "Hàng tháng",
      desc: "Kế hoạch cho cao điểm thu hoạch",
    },
  ];
  const y3_harvest_rev: GuideItem[] = [
    {
      id: "y3-06",
      title: "Dự trù sản lượng năm 3",
      window: "Mùa thu–đông",
      desc: "~15 kg tươi/cây (tham chiếu)",
    },
    {
      id: "y3-07",
      title: "Hái, chế biến, bán hàng",
      window: "Theo lịch chín",
      desc: "Chuẩn hóa quy trình và truy xuất",
    },
  ];
  const y3_complianceExtra: GuideItem[] = [];
  if (has(P.certifications, "GlobalGAP"))
    y3_complianceExtra.push({
      id: "y3-gg-calib",
      title: "GlobalG.A.P.: Hiệu chuẩn thiết bị",
      window: "Hàng năm",
    });
  if (has(P.certifications, "VietGAP"))
    y3_complianceExtra.push({
      id: "y3-vg-internal",
      title: "VietGAP: Tự đánh giá nội bộ",
      window: "Hàng năm",
    });
  if (has(P.certifications, "FLO"))
    y3_complianceExtra.push({
      id: "y3-flo-premium",
      title: "FLO: Họp & công khai Quỹ Premium",
      window: "Cuối vụ",
    });

  const years: GuideYear[] = [
    {
      year: 1,
      sections: [
        { name: "Chuẩn bị đất & quy hoạch", items: y1_prepare },
        { name: "Tưới & trồng mới", items: y1_irrigate_plant },
        { name: "Chăm sóc năm 1", items: y1_care },
        { name: "Tuân thủ & hồ sơ (ưu tiên)", items: y1_compliance },
      ],
    },
    {
      year: 2,
      sections: [
        { name: "Dinh dưỡng & bảo vệ", items: y2_nutri_protect },
        { name: "Nước & quản lý", items: y2_water_mgmt },
        { name: "Thu hoạch & chế biến", items: y2_harvest },
        ...(y2_complianceExtra.length
          ? [{ name: "Tuân thủ (duy trì)", items: y2_complianceExtra }]
          : []),
      ],
    },
    {
      year: 3,
      sections: [
        { name: "Dinh dưỡng & BVTV", items: y3_nutri_bvtv },
        { name: "Nước & quản lý", items: y3_water_mgmt },
        { name: "Thu hoạch & doanh thu", items: y3_harvest_rev },
        ...(y3_complianceExtra.length
          ? [{ name: "Tuân thủ (duy trì)", items: y3_complianceExtra }]
          : []),
      ],
    },
  ];

  // chuẩn hóa ID tránh trùng
  let seq = 0;
  years.forEach((y) =>
    y.sections.forEach((s) =>
      s.items.forEach((it) => {
        if (!it.id) it.id = `auto-${y.year}-${++seq}`;
      })
    )
  );

  return years;
}

// ==== Tuỳ chọn: default theo giả định nếu cần dùng ngay (giống cấu trúc cũ) ====
export const GUIDE_YEARS_DEFAULT: GuideYear[] = buildGuide({
  crop: "robusta",
  variety: "Robusta",
  plantingMonth: 8,
  soilTexture: "loam",
  ph: 5.5,
  annualRain_mm: 1600,
  tmean_c: 24,
  certifications: [],
});
