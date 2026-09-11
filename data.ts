import { MonthlyData, PostData } from './types';

export const RAW_DATA: MonthlyData[] = [
  // --- DADOS 2023 ---
  {
    id: "2023-01", year: 2023, month: "01", monthName: "Janeiro",
    instagram: { reach: 16650, interactions: 3882, engagementRate: 23.32, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 22351, interactions: 333, engagementRate: 1.49, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 3962, uniqueImpressions: 3962, interactions: 736, engagementRate: 18.58, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 736, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 42963, interactions: 4951, engagementRate: 11.52 }
  },
  {
    id: "2023-02", year: 2023, month: "02", monthName: "Fevereiro",
    instagram: { reach: 15412, interactions: 5154, engagementRate: 33.44, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 18705, interactions: 204, engagementRate: 1.09, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 3409, uniqueImpressions: 3409, interactions: 513, engagementRate: 15.05, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 513, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 37526, interactions: 5871, engagementRate: 15.65 }
  },
  {
    id: "2023-03", year: 2023, month: "03", monthName: "Março",
    instagram: { reach: 21800, interactions: 6135, engagementRate: 28.14, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 18431, interactions: 261, engagementRate: 1.42, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 3022, uniqueImpressions: 3022, interactions: 763, engagementRate: 25.25, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 763, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 43253, interactions: 7159, engagementRate: 16.55 }
  },
  {
    id: "2023-04", year: 2023, month: "04", monthName: "Abril",
    instagram: { reach: 31762, interactions: 6125, engagementRate: 19.28, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 15865, interactions: 181, engagementRate: 1.14, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 3003, uniqueImpressions: 3003, interactions: 845, engagementRate: 28.14, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 845, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 50630, interactions: 7151, engagementRate: 14.12 }
  },
  {
    id: "2023-05", year: 2023, month: "05", monthName: "Maio",
    instagram: { reach: 19938, interactions: 8613, engagementRate: 43.20, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 22439, interactions: 386, engagementRate: 1.72, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4092, uniqueImpressions: 4092, interactions: 900, engagementRate: 21.99, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 900, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 46469, interactions: 9899, engagementRate: 21.30 }
  },
  {
    id: "2023-06", year: 2023, month: "06", monthName: "Junho",
    instagram: { reach: 32656, interactions: 10058, engagementRate: 30.80, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 30175, interactions: 963, engagementRate: 3.19, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4419, uniqueImpressions: 4419, interactions: 1566, engagementRate: 35.44, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 1566, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 67250, interactions: 12587, engagementRate: 18.72 }
  },
  {
    id: "2023-07", year: 2023, month: "07", monthName: "Julho",
    instagram: { reach: 21132, interactions: 8733, engagementRate: 41.33, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 14783, interactions: 244, engagementRate: 1.65, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4535, uniqueImpressions: 4535, interactions: 919, engagementRate: 20.26, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 919, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 40450, interactions: 9896, engagementRate: 24.46 }
  },
  {
    id: "2023-08", year: 2023, month: "08", monthName: "Agosto",
    instagram: { reach: 14105, interactions: 5198, engagementRate: 36.85, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 18141, interactions: 213, engagementRate: 1.17, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 5068, uniqueImpressions: 5068, interactions: 782, engagementRate: 15.43, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 782, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 37314, interactions: 6193, engagementRate: 16.60 }
  },
  {
    id: "2023-09", year: 2023, month: "09", monthName: "Setembro",
    instagram: { reach: 20934, interactions: 7876, engagementRate: 37.62, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 10902, interactions: 271, engagementRate: 2.49, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4719, uniqueImpressions: 4719, interactions: 546, engagementRate: 11.57, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 546, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 36555, interactions: 8693, engagementRate: 23.78 }
  },
  {
    id: "2023-10", year: 2023, month: "10", monthName: "Outubro",
    instagram: { reach: 17417, interactions: 8668, engagementRate: 49.77, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 10355, interactions: 290, engagementRate: 2.80, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4002, uniqueImpressions: 4002, interactions: 580, engagementRate: 14.49, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 580, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 31774, interactions: 9538, engagementRate: 30.02 }
  },
  {
    id: "2023-11", year: 2023, month: "11", monthName: "Novembro",
    instagram: { reach: 25550, interactions: 7427, engagementRate: 29.07, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 10170, interactions: 284, engagementRate: 2.79, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4387, uniqueImpressions: 4387, interactions: 751, engagementRate: 17.12, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 751, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 40107, interactions: 8462, engagementRate: 21.10 }
  },
  {
    id: "2023-12", year: 2023, month: "12", monthName: "Dezembro",
    instagram: { reach: 18472, interactions: 7838, engagementRate: 42.43, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    facebook: { reach: 9005, interactions: 205, engagementRate: 2.28, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0 },
    linkedin: { reach: 4998, uniqueImpressions: 4998, interactions: 698, engagementRate: 13.97, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 698, comments: 0, shares: 0 },
    total: { followerIncrease: 0, followerIncreasePercent: 0, reach: 32475, interactions: 8741, engagementRate: 26.92 }
  },

  // --- DADOS 2024 ---
  {
    id: "2024-01", year: 2024, month: "01", monthName: "Janeiro",
    instagram: { reach: 25689, interactions: 5242, engagementRate: 20.41, followers: 0, profileVisits: 6423, clicks: 42, views: 0, contacts: 158 },
    facebook: { reach: 16414, interactions: 337, engagementRate: 2.05, followers: 22, profileVisits: 1626, clicks: 13, views: 0, contacts: 5 },
    linkedin: { reach: 5560, uniqueImpressions: 5560, interactions: 132, engagementRate: 2.37, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 132, comments: 0, shares: 0 },
    total: { followerIncrease: 22, followerIncreasePercent: 0, reach: 47663, interactions: 5711, engagementRate: 11.98 }
  },
  {
    id: "2024-02", year: 2024, month: "02", monthName: "Fevereiro",
    instagram: { reach: 17056, interactions: 5000, engagementRate: 29.32, followers: 0, profileVisits: 6273, clicks: 0, views: 0, contacts: 140 },
    facebook: { reach: 14844, interactions: 692, engagementRate: 4.66, followers: 20, profileVisits: 1688, clicks: 5, views: 0, contacts: 3 },
    linkedin: { reach: 7751, uniqueImpressions: 7751, interactions: 167, engagementRate: 2.15, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 167, comments: 0, shares: 0 },
    total: { followerIncrease: 20, followerIncreasePercent: -9, reach: 39651, interactions: 5859, engagementRate: 14.78 }
  },
  {
    id: "2024-03", year: 2024, month: "03", monthName: "Março",
    instagram: { reach: 21698, interactions: 9072, engagementRate: 41.81, followers: 0, profileVisits: 6902, clicks: 72, views: 0, contacts: 198 },
    facebook: { reach: 24709, interactions: 770, engagementRate: 3.12, followers: 37, profileVisits: 2075, clicks: 106, views: 0, contacts: 3 },
    linkedin: { reach: 10128, uniqueImpressions: 10128, interactions: 171, engagementRate: 1.69, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 171, comments: 0, shares: 0 },
    total: { followerIncrease: 37, followerIncreasePercent: 85, reach: 56535, interactions: 10013, engagementRate: 17.71 }
  },
  {
    id: "2024-04", year: 2024, month: "04", monthName: "Abril",
    instagram: { reach: 20372, interactions: 4600, engagementRate: 22.58, followers: 0, profileVisits: 6385, clicks: 0, views: 0, contacts: 188 },
    facebook: { reach: 18665, interactions: 313, engagementRate: 1.68, followers: 14, profileVisits: 1557, clicks: 17, views: 0, contacts: 8 },
    linkedin: { reach: 5981, uniqueImpressions: 5981, interactions: 99, engagementRate: 1.66, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 99, comments: 0, shares: 0 },
    total: { followerIncrease: 14, followerIncreasePercent: -62, reach: 45018, interactions: 5012, engagementRate: 11.13 }
  },
  {
    id: "2024-05", year: 2024, month: "05", monthName: "Maio",
    instagram: { reach: 29886, interactions: 7300, engagementRate: 24.43, followers: 0, profileVisits: 7671, clicks: 60, views: 0, contacts: 161 },
    facebook: { reach: 15190, interactions: 463, engagementRate: 3.05, followers: 9, profileVisits: 1225, clicks: 0, views: 0, contacts: 8 },
    linkedin: { reach: 13002, uniqueImpressions: 13002, interactions: 220, engagementRate: 1.69, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 220, comments: 0, shares: 0 },
    total: { followerIncrease: 9, followerIncreasePercent: -36, reach: 58078, interactions: 7983, engagementRate: 13.75 }
  },
  {
    id: "2024-06", year: 2024, month: "06", monthName: "Junho",
    instagram: { reach: 46483, interactions: 10400, engagementRate: 22.37, followers: 0, profileVisits: 6549, clicks: 17, views: 0, contacts: 197 },
    facebook: { reach: 18434, interactions: 494, engagementRate: 2.68, followers: 11, profileVisits: 1053, clicks: 0, views: 0, contacts: 9 },
    linkedin: { reach: 15472, uniqueImpressions: 15472, interactions: 401, engagementRate: 2.59, followers: 0, profileVisits: 0, clicks: 0, views: 0, contacts: 0, reactions: 401, comments: 0, shares: 0 },
    total: { followerIncrease: 11, followerIncreasePercent: 22, reach: 80389, interactions: 11295, engagementRate: 14.05 }
  },
  {
    id: "2024-07", year: 2024, month: "07", monthName: "Julho",
    instagram: { reach: 37031, interactions: 6400, engagementRate: 17.28, followers: 771, profileVisits: 6333, clicks: 0, views: 635487, contacts: 168 },
    facebook: { reach: 12927, interactions: 447, engagementRate: 3.46, followers: 19, profileVisits: 1365, clicks: 0, views: 173359, contacts: 4 },
    linkedin: { reach: 7085, uniqueImpressions: 7085, interactions: 149, engagementRate: 2.10, followers: 30, profileVisits: 544, clicks: 1152, views: 8896, contacts: 1, reactions: 149, comments: 0, shares: 1 },
    total: { followerIncrease: 820, followerIncreasePercent: 7355, reach: 57043, interactions: 6996, engagementRate: 12.26 }
  },
  {
    id: "2024-08", year: 2024, month: "08", monthName: "Agosto",
    instagram: { reach: 44926, interactions: 7400, engagementRate: 16.47, followers: 783, profileVisits: 7110, clicks: 0, views: 704897, contacts: 164 },
    facebook: { reach: 12068, interactions: 304, engagementRate: 2.52, followers: 21, profileVisits: 1086, clicks: 2, views: 69339, contacts: 2 },
    linkedin: { reach: 6923, uniqueImpressions: 6923, interactions: 233, engagementRate: 3.37, followers: 115, profileVisits: 682, clicks: 4850, views: 15857, contacts: 0, reactions: 233, comments: 1, shares: 0 },
    total: { followerIncrease: 919, followerIncreasePercent: 12, reach: 63917, interactions: 7937, engagementRate: 12.42 }
  },
  {
    id: "2024-09", year: 2024, month: "09", monthName: "Setembro",
    instagram: { reach: 41862, interactions: 9800, engagementRate: 23.41, followers: 630, profileVisits: 7385, clicks: 121, views: 789496, contacts: 177 },
    facebook: { reach: 15286, interactions: 412, engagementRate: 2.70, followers: 19, profileVisits: 1138, clicks: 1, views: 72147, contacts: 6 },
    linkedin: { reach: 11466, uniqueImpressions: 11466, interactions: 446, engagementRate: 3.89, followers: 155, profileVisits: 826, clicks: 13496, views: 27585, contacts: 0, reactions: 446, comments: 8, shares: 1 },
    total: { followerIncrease: 804, followerIncreasePercent: -13, reach: 68614, interactions: 10658, engagementRate: 15.53 }
  },
  {
    id: "2024-10", year: 2024, month: "10", monthName: "Outubro",
    instagram: { reach: 58366, interactions: 13600, engagementRate: 23.30, followers: 808, profileVisits: 8604, clicks: 173, views: 709587, contacts: 227 },
    facebook: { reach: 15503, interactions: 541, engagementRate: 3.49, followers: 20, profileVisits: 1308, clicks: 0, views: 82807, contacts: 12 },
    linkedin: { reach: 7345, uniqueImpressions: 7345, interactions: 312, engagementRate: 4.25, followers: 147, profileVisits: 960, clicks: 2740, views: 18284, contacts: 2, reactions: 312, comments: 4, shares: 4 },
    total: { followerIncrease: 975, followerIncreasePercent: 21, reach: 81214, interactions: 14453, engagementRate: 17.80 }
  },
  {
    id: "2024-11", year: 2024, month: "11", monthName: "Novembro",
    instagram: { reach: 63380, interactions: 12700, engagementRate: 20.04, followers: 1017, profileVisits: 10529, clicks: 2, views: 758948, contacts: 303 },
    facebook: { reach: 17729, interactions: 716, engagementRate: 4.04, followers: 16, profileVisits: 1334, clicks: 2, views: 114100, contacts: 16 },
    linkedin: { reach: 5901, uniqueImpressions: 5901, interactions: 177, engagementRate: 3.00, followers: 128, profileVisits: 1035, clicks: 1893, views: 13176, contacts: 3, reactions: 177, comments: 1, shares: 1 },
    total: { followerIncrease: 1161, followerIncreasePercent: 19, reach: 87010, interactions: 13593, engagementRate: 15.62 }
  },
  {
    id: "2024-12", year: 2024, month: "12", monthName: "Dezembro",
    instagram: { reach: 73773, interactions: 13806, engagementRate: 18.71, followers: 938, profileVisits: 13065, clicks: 13, views: 1268592, contacts: 372 },
    facebook: { reach: 23712, interactions: 1781, engagementRate: 7.51, followers: 52, profileVisits: 2072, clicks: 0, views: 173359, contacts: 17 },
    linkedin: { reach: 5194, uniqueImpressions: 5194, interactions: 103, engagementRate: 1.98, followers: 70, profileVisits: 635, clicks: 2661, views: 12023, contacts: 1, reactions: 103, comments: 1, shares: 0 },
    total: { followerIncrease: 1060, followerIncreasePercent: -9, reach: 102679, interactions: 15690, engagementRate: 15.28 }
  },

  // --- DADOS 2025 ---
  {
    id: "2025-01", year: 2025, month: "01", monthName: "Janeiro",
    instagram: { reach: 53533, interactions: 9090, engagementRate: 16.98, followers: 805, profileVisits: 7687, clicks: 26, views: 804180, contacts: 193 },
    facebook: { reach: 14942, interactions: 523, engagementRate: 3.50, followers: 19, profileVisits: 1173, clicks: 1, views: 69339, contacts: 9 },
    linkedin: { reach: 3608, uniqueImpressions: 3608, interactions: 105, engagementRate: 2.91, followers: 81, profileVisits: 673, clicks: 1711, views: 9446, contacts: 1, reactions: 105, comments: 1, shares: 0 },
    total: { followerIncrease: 905, followerIncreasePercent: -15, reach: 72083, interactions: 9718, engagementRate: 13.48 }
  },
  {
    id: "2025-02", year: 2025, month: "02", monthName: "Fevereiro",
    instagram: { reach: 52908, interactions: 9228, engagementRate: 17.44, followers: 743, profileVisits: 7828, clicks: 0, views: 860214, contacts: 202 },
    facebook: { reach: 13189, interactions: 557, engagementRate: 4.22, followers: 18, profileVisits: 1001, clicks: 4, views: 72147, contacts: 8 },
    linkedin: { reach: 8680, uniqueImpressions: 8680, interactions: 325, engagementRate: 3.74, followers: 145, profileVisits: 806, clicks: 9477, views: 18889, contacts: 0, reactions: 325, comments: 14, shares: 1 },
    total: { followerIncrease: 906, followerIncreasePercent: 0, reach: 74777, interactions: 10110, engagementRate: 13.52 }
  },
  {
    id: "2025-03", year: 2025, month: "03", monthName: "Março",
    instagram: { reach: 84231, interactions: 11651, engagementRate: 13.83, followers: 831, profileVisits: 9093, clicks: 267, views: 1084339, contacts: 232 },
    facebook: { reach: 18399, interactions: 680, engagementRate: 3.70, followers: 22, profileVisits: 1073, clicks: 8, views: 78147, contacts: 20 },
    linkedin: { reach: 7984, uniqueImpressions: 7984, interactions: 511, engagementRate: 6.40, followers: 239, profileVisits: 1180, clicks: 4596, views: 21312, contacts: 3, reactions: 511, comments: 17, shares: 5 },
    total: { followerIncrease: 1092, followerIncreasePercent: 21, reach: 110614, interactions: 12842, engagementRate: 11.61 }
  },
  {
    id: "2025-04", year: 2025, month: "04", monthName: "Abril",
    instagram: { reach: 53845, interactions: 7731, engagementRate: 14.36, followers: 767, profileVisits: 7033, clicks: 120, views: 718125, contacts: 181 },
    facebook: { reach: 32852, interactions: 710, engagementRate: 2.16, followers: 41, profileVisits: 1150, clicks: 13, views: 74681, contacts: 13 },
    linkedin: { reach: 6275, uniqueImpressions: 6275, interactions: 288, engagementRate: 4.59, followers: 148, profileVisits: 970, clicks: 872, views: 15863, contacts: 1, reactions: 288, comments: 4, shares: 3 },
    total: { followerIncrease: 956, followerIncreasePercent: -12, reach: 92972, interactions: 8729, engagementRate: 9.39 }
  },
  {
    id: "2025-05", year: 2025, month: "05", monthName: "Maio",
    instagram: { reach: 103327, interactions: 17901, engagementRate: 17.32, followers: 959, profileVisits: 9177, clicks: 53, views: 1304631, contacts: 243 },
    facebook: { reach: 34274, interactions: 892, engagementRate: 2.60, followers: 43, profileVisits: 1029, clicks: 1, views: 84014, contacts: 11 },
    linkedin: { reach: 4585, uniqueImpressions: 4585, interactions: 243, engagementRate: 5.30, followers: 151, profileVisits: 717, clicks: 708, views: 12599, contacts: 1, reactions: 243, comments: 2, shares: 7 },
    total: { followerIncrease: 1153, followerIncreasePercent: 21, reach: 142186, interactions: 19036, engagementRate: 13.39 }
  },
  {
    id: "2025-06", year: 2025, month: "06", monthName: "Junho",
    instagram: { reach: 72844, interactions: 12192, engagementRate: 16.74, followers: 867, profileVisits: 7900, clicks: 10, views: 1048809, contacts: 90 },
    facebook: { reach: 56900, interactions: 333, engagementRate: 0.59, followers: 24, profileVisits: 1100, clicks: 0, views: 63800, contacts: 2 },
    linkedin: { reach: 7085, uniqueImpressions: 7085, interactions: 264, engagementRate: 3.73, followers: 143, profileVisits: 765, clicks: 2028, views: 16975, contacts: 0, reactions: 264, comments: 3, shares: 5 },
    total: { followerIncrease: 1034, followerIncreasePercent: -10, reach: 136829, interactions: 12789, engagementRate: 9.35 }
  },
  {
    id: "2025-07", year: 2025, month: "07", monthName: "Julho",
    instagram: { reach: 73409, interactions: 10652, engagementRate: 14.51, followers: 845, profileVisits: 9965, clicks: 12, views: 1103297, contacts: 32 },
    facebook: { reach: 33872, interactions: 707, engagementRate: 2.09, followers: 26, profileVisits: 1241, clicks: 1, views: 81660, contacts: 0 },
    linkedin: { reach: 8155, uniqueImpressions: 8155, interactions: 353, engagementRate: 4.33, followers: 141, profileVisits: 667, clicks: 2209, views: 20749, contacts: 3, reactions: 353, comments: 10, shares: 3 },
    total: { followerIncrease: 1012, followerIncreasePercent: -2, reach: 115436, interactions: 11712, engagementRate: 10.15 }
  },
  {
    id: "2025-08", year: 2025, month: "08", monthName: "Agosto",
    instagram: { reach: 212671, interactions: 29080, engagementRate: 13.67, followers: 2165, profileVisits: 12386, clicks: 0, views: 1964544, contacts: 257 },
    facebook: { reach: 15790, interactions: 680, engagementRate: 4.31, followers: 24, profileVisits: 1151, clicks: 0, views: 79677, contacts: 1 },
    linkedin: { reach: 10264, uniqueImpressions: 10264, interactions: 661, engagementRate: 6.44, followers: 141, profileVisits: 753, clicks: 4663, views: 29756, contacts: 1, reactions: 661, comments: 15, shares: 8 },
    total: { followerIncrease: 2330, followerIncreasePercent: 130, reach: 238725, interactions: 30421, engagementRate: 12.74 }
  },
  {
    id: "2025-09", year: 2025, month: "09", monthName: "Setembro",
    instagram: { reach: 108500, interactions: 15400, engagementRate: 14.19, followers: 1100, profileVisits: 11500, clicks: 31, views: 1700000, contacts: 229 },
    facebook: { reach: 26700, interactions: 674, engagementRate: 2.52, followers: 42, profileVisits: 1400, clicks: 0, views: 99500, contacts: 4 },
    linkedin: { reach: 6503, uniqueImpressions: 6503, interactions: 190, engagementRate: 2.92, followers: 159, profileVisits: 345, clicks: 1843, views: 16418, contacts: 3, reactions: 190, comments: 1, shares: 3 },
    total: { followerIncrease: 1301, followerIncreasePercent: -44, reach: 141703, interactions: 16264, engagementRate: 11.48 }
  },
  {
    id: "2025-10", year: 2025, month: "10", monthName: "Outubro",
    instagram: { reach: 136100, interactions: 35000, engagementRate: 25.72, followers: 1300, profileVisits: 12500, clicks: 141, views: 1700000, contacts: 238 },
    facebook: { reach: 34600, interactions: 1300, engagementRate: 3.76, followers: 63, profileVisits: 1700, clicks: 0, views: 117100, contacts: 5 },
    linkedin: { reach: 13138, uniqueImpressions: 13138, interactions: 184, engagementRate: 1.40, followers: 93, profileVisits: 891, clicks: 582, views: 13138, contacts: 1, reactions: 184, comments: 7, shares: 0 },
    total: { followerIncrease: 1456, followerIncreasePercent: 12, reach: 183838, interactions: 36484, engagementRate: 19.85 }
  },
  {
    id: "2025-11", year: 2025, month: "11", monthName: "Novembro",
    instagram: { reach: 64600, interactions: 11800, engagementRate: 18.27, followers: 698, profileVisits: 7700, clicks: 0, views: 1100000, contacts: 208 },
    facebook: { reach: 26600, interactions: 852, engagementRate: 3.20, followers: 46, profileVisits: 1900, clicks: 0, views: 92900, contacts: 1 },
    linkedin: { reach: 6328, uniqueImpressions: 6328, interactions: 229, engagementRate: 3.62, followers: 84, profileVisits: 763, clicks: 1152, views: 14075, contacts: 2, reactions: 229, comments: 3, shares: 2 },
    total: { followerIncrease: 828, followerIncreasePercent: -43, reach: 97528, interactions: 12881, engagementRate: 13.21 }
  },
  {
    id: "2025-12", year: 2025, month: "12", monthName: "Dezembro",
    instagram: { reach: 74500, interactions: 17000, engagementRate: 22.82, followers: 798, profileVisits: 9600, clicks: 20, views: 1700000, contacts: 392 },
    facebook: { reach: 48600, interactions: 1300, engagementRate: 2.67, followers: 92, profileVisits: 1900, clicks: 0, views: 152200, contacts: 6 },
    linkedin: { reach: 15808, uniqueImpressions: 15808, interactions: 222, engagementRate: 1.40, followers: 58, profileVisits: 538, clicks: 4595, views: 15502, contacts: 2, reactions: 222, comments: 3, shares: 0 },
    total: { followerIncrease: 948, followerIncreasePercent: 14, reach: 138908, interactions: 18522, engagementRate: 13.33 }
  },

  // --- DADOS 2026 ---
  {
    id: "2026-01", year: 2026, month: "01", monthName: "Janeiro",
    instagram: { reach: 60900, interactions: 10700, engagementRate: 17.57, followers: 941, profileVisits: 8300, clicks: 0, views: 1000000, contacts: 239 },
    facebook: { reach: 14900, interactions: 547, engagementRate: 3.67, followers: 56, profileVisits: 1500, clicks: 0, views: 57200, contacts: 2 },
    linkedin: { reach: 6952, uniqueImpressions: 6952, interactions: 228, engagementRate: 3.28, followers: 82, profileVisits: 897, clicks: 8481, views: 18936, contacts: 1, reactions: 228, comments: 4, shares: 0 },
    total: { followerIncrease: 1079, followerIncreasePercent: 14, reach: 82752, interactions: 11475, engagementRate: 13.87 }
  },
  {
    id: "2026-02", year: 2026, month: "02", monthName: "Fevereiro",
    instagram: { reach: 50900, interactions: 6800, engagementRate: 13.36, followers: 754, profileVisits: 7700, clicks: 0, views: 1000000, contacts: 233 },
    facebook: { reach: 16600, interactions: 456, engagementRate: 2.75, followers: 16, profileVisits: 1400, clicks: 0, views: 53500, contacts: 17 },
    linkedin: { reach: 5262, uniqueImpressions: 5262, interactions: 164, engagementRate: 3.12, followers: 101, profileVisits: 932, clicks: 3810, views: 11590, contacts: 4, reactions: 164, comments: 0, shares: 1 },
    total: { followerIncrease: 871, followerIncreasePercent: -19, reach: 72762, interactions: 7420, engagementRate: 10.20 }
  },
  {
    id: "2026-03", year: 2026, month: "03", monthName: "Março",
    instagram: { reach: 69000, interactions: 11500, engagementRate: 16.67, followers: 903, profileVisits: 7900, clicks: 191, views: 885000, contacts: 277 },
    facebook: { reach: 11300, interactions: 378, engagementRate: 3.35, followers: 29, profileVisits: 1300, clicks: 0, views: 24700, contacts: 2 },
    linkedin: { reach: 6361, uniqueImpressions: 6361, interactions: 80, engagementRate: 1.26, followers: 109, profileVisits: 958, clicks: 993, views: 6361, contacts: 1, reactions: 80, comments: 0, shares: 0 },
    total: { followerIncrease: 1041, followerIncreasePercent: 20, reach: 86661, interactions: 11958, engagementRate: 13.80 }
  },
  {
    id: "2026-04", year: 2026, month: "04", monthName: "Abril",
    instagram: { reach: 58000, interactions: 8400, engagementRate: 14.48, followers: 857, profileVisits: 8900, clicks: 0, views: 739700, contacts: 239 },
    facebook: { reach: 11600, interactions: 456, engagementRate: 3.93, followers: 14, profileVisits: 732, clicks: 0, views: 32800, contacts: 3 },
    linkedin: { reach: 5726, uniqueImpressions: 5726, interactions: 97, engagementRate: 1.69, followers: 69, profileVisits: 836, clicks: 485, views: 5726, contacts: 0, reactions: 97, comments: 2, shares: 8 },
    total: { followerIncrease: 940, followerIncreasePercent: -10, reach: 75326, interactions: 8953, engagementRate: 11.89 }
  }
];

export const POSTS_DATA: PostData[] = [
  // RANKING DE POSTS (Tabelas do Anexo 2)
  { id: "p1", title: "Podcast - Dr. Júlio Veloso, Pediatra, UTI Neonatal", month: "julho/2025", type: "Podcast", reach: 2100, interactions: 281, engagement: 13.38 },
  { id: "p2", title: "Dia Nacional de Alerta à Insuficiência Cardíaca", month: "julho/2025", type: "Reels", reach: 4900, interactions: 527, engagement: 10.76 },
  { id: "p3", title: "Podcast com a Dayse", month: "junho/2025", type: "Podcast", reach: 2100, interactions: 192, engagement: 9.14 },
  { id: "p4", title: "Podcast com Elis Regina - Tema: Compliance no CSSJD", month: "julho/2025", type: "Podcast", reach: 4700, interactions: 380, engagement: 8.09 },
  { id: "p5", title: "Podcast com Elis Regina - Tema: Compliance (2)", month: "julho/2025", type: "Podcast", reach: 4800, interactions: 383, engagement: 7.98 },
  { id: "p6", title: "Podcast - Dr. Rossini e do Dr. Daniel Soares", month: "julho/2025", type: "Podcast", reach: 2100, interactions: 166, engagement: 7.90 },
  { id: "p7", title: "Podcast com o Dr. Júlio", month: "julho/2025", type: "Podcast", reach: 1700, interactions: 129, engagement: 7.59 },
  { id: "p8", title: "PodCast com Ana Caroline - Compliance", month: "julho/2025", type: "Podcast", reach: 4300, interactions: 325, engagement: 7.56 },
  { id: "p9", title: "Podcast - Dr. Rossini e do Dr. Daniel (2)", month: "julho/2025", type: "Podcast", reach: 2400, interactions: 179, engagement: 7.46 },
  { id: "p10", title: "Podcast sobre Refaces", month: "julho/2025", type: "Podcast", reach: 2000, interactions: 147, engagement: 7.35 },
  { id: "p11", title: "Podcast sobre Luto", month: "julho/2025", type: "Podcast", reach: 2100, interactions: 151, engagement: 7.19 },
  { id: "p12", title: "Dia Conscientização da Cardiopatia Congênita", month: "junho/2025", type: "Reels", reach: 5900, interactions: 414, engagement: 7.02 },
  { id: "p13", title: "Dia do Pediatra - Dr. Júlio César Velosl", month: "julho/2025", type: "Reels", reach: 7200, interactions: 502, engagement: 6.97 },
  { id: "p14", title: "Dia do endoscopista - Especialistas", month: "julho/2025", type: "Data Comemorativa", reach: 11400, interactions: 768, engagement: 6.74 },
  { id: "p15", title: "Podcast sobre Refaces (2)", month: "julho/2025", type: "Podcast", reach: 1100, interactions: 73, engagement: 6.64 },
  { id: "p16", title: "Podcast - Infarto Agudo do Miocárdio?", month: "junho/2025", type: "Podcast", reach: 5200, interactions: 345, engagement: 6.63 },
  { id: "p17", title: "Podcast sobre o REFACES", month: "julho/2025", type: "Podcast", reach: 1400, interactions: 92, engagement: 6.57 },
  { id: "p18", title: "Vagas em aberto - todas", month: "julho/2025", type: "Vagas", reach: 9900, interactions: 636, engagement: 6.42 },
  { id: "p19", title: "Dia do Cirurgião geral - Dr. Renato Corgozinho", month: "julho/2025", type: "Data Comemorativa", reach: 4000, interactions: 250, engagement: 6.25 },
  { id: "p20", title: "Dia do Adm Hospitalar - Carrossel Gestores", month: "julho/2025", type: "Data Comemorativa", reach: 9000, interactions: 553, engagement: 6.14 },
  { id: "p21", title: "Podcast com a Joelma", month: "junho/2025", type: "Podcast", reach: 3100, interactions: 190, engagement: 6.13 },
  { id: "p22", title: "Podcast Elis (Regulação de Leitos)", month: "junho/2025", type: "Podcast", reach: 5600, interactions: 339, engagement: 6.05 },
  { id: "p23", title: "Podcast - Dr. Rossini e Dr. Daniel (3)", month: "julho/2025", type: "Podcast", reach: 1600, interactions: 96, engagement: 6.00 },
  { id: "p24", title: "Depoimento da Paciente sobre Doação de Sangue", month: "julho/2025", type: "Reels", reach: 21800, interactions: 1300, engagement: 5.96 },
  { id: "p25", title: "Podcast sobre o Luto (2)", month: "julho/2025", type: "Podcast", reach: 2100, interactions: 124, engagement: 5.90 },
  { id: "p26", title: "Podcast - Dr. Rossini e Dr. Daniel (4)", month: "julho/2025", type: "Podcast", reach: 1300, interactions: 70, engagement: 5.38 },
  { id: "p27", title: "Post dia dos Namorados - Izadora e Thiago", month: "julho/2025", type: "Data Comemorativa", reach: 9300, interactions: 499, engagement: 5.37 },
  { id: "p28", title: "Poscast chamada", month: "julho/2025", type: "Podcast", reach: 1500, interactions: 80, engagement: 5.33 },
  { id: "p29", title: "Post Sobre doação de Sangue - Depoimento", month: "junho/2025", type: "Reels", reach: 4700, interactions: 247, engagement: 5.26 },
  { id: "p30", title: "Release sobre o voluntariado", month: "junho/2025", type: "Matéria", reach: 4000, interactions: 195, engagement: 4.88 },
  { id: "p31", title: "Aniversário do CSSJD (conquistas, números)", month: "junho/2025", type: "Post", reach: 8500, interactions: 404, engagement: 4.75 },
  { id: "p32", title: "Podcast Com Elis (Regulação de Leitos)", month: "junho/2025", type: "Podcast", reach: 5900, interactions: 260, engagement: 4.41 },
  { id: "p33", title: "Podcast Elis Regina - Regulação (2)", month: "junho/2025", type: "Podcast", reach: 5900, interactions: 260, engagement: 4.41 },
  { id: "p34", title: "Colab - Commission Antineoplásicos", month: "junho/2025", type: "Reels", reach: 6220, interactions: 196, engagement: 3.15 },
  { id: "p35", title: "Vaga Enfermagem, Fono e Auxiliar PCD", month: "junho/2025", type: "Vagas", reach: 12200, interactions: 360, engagement: 2.95 },
  { id: "p36", title: "Vaga Maqueiro e Coordenador CME", month: "junho/2025", type: "Vagas", reach: 12000, interactions: 293, engagement: 2.44 },
  { id: "p37", title: "Vaga Farmacêutico", month: "junho/2025", type: "Vagas", reach: 7700, interactions: 133, engagement: 1.73 },
  { id: "p38", title: "Vaga Supervisor de TI", month: "junho/2025", type: "Vagas", reach: 7700, interactions: 106, engagement: 1.38 },
  { id: "p39", title: "Vaga de Estagiário de TI", month: "junho/2025", type: "Vagas", reach: 6600, interactions: 84, engagement: 1.27 },
  { id: "p40", title: "Vaga Terapeuta Ocupacional", month: "junho/2025", type: "Vagas", reach: 6200, interactions: 49, engagement: 0.79 },

  // --- DADOS AGOSTO 2025 ---
  { id: "p41", title: "Podcast Agosto", month: "agosto/2025", type: "Podcast", reach: 1702, interactions: 227, engagement: 13.34 },
  { id: "p42", title: "Benção do Santíssimo no CSSJD", month: "agosto/2025", type: "Reels", reach: 56260, interactions: 6873, engagement: 12.22 },
  { id: "p43", title: "Podcast Agosto (2)", month: "agosto/2025", type: "Podcast", reach: 2967, interactions: 335, engagement: 11.29 },
  { id: "p44", title: "Novo Centro de Nefrologia", month: "agosto/2025", type: "Post", reach: 7386, interactions: 785, engagement: 10.63 },
  { id: "p45", title: "Podcast Agosto (3)", month: "agosto/2025", type: "Podcast", reach: 2222, interactions: 213, engagement: 9.59 },
  { id: "p46", title: "Podcast Agosto (4)", month: "agosto/2025", type: "Podcast", reach: 1995, interactions: 187, engagement: 9.37 },
  { id: "p47", title: "CSSJD - 36º Congresso Brasileiro de Cirurgia (CBC)", month: "agosto/2025", type: "Matéria", reach: 2896, interactions: 228, engagement: 7.87 },
  { id: "p48", title: "Dia dos Pais", month: "agosto/2025", type: "Post", reach: 10583, interactions: 762, engagement: 7.20 },
  { id: "p49", title: "Podcast Agosto (5)", month: "agosto/2025", type: "Podcast", reach: 2460, interactions: 165, engagement: 6.71 },
  { id: "p50", title: "Podcast Agosto (6)", month: "agosto/2025", type: "Podcast", reach: 2511, interactions: 160, engagement: 6.37 },
  { id: "p51", title: "Moderno Sistema de Reconhecimento Facial", month: "agosto/2025", type: "Matéria", reach: 4291, interactions: 255, engagement: 5.94 },
  { id: "p52", title: "Dr. Robert vascular representa MG na Univ. de Chicago", month: "agosto/2025", type: "Matéria", reach: 3032, interactions: 168, engagement: 5.54 },
  { id: "p53", title: "Dr. Sidnei Campidell - mediador no Pensar Mineiro 2025", month: "agosto/2025", type: "Matéria", reach: 6620, interactions: 347, engagement: 5.24 },
  { id: "p54", title: "Paciente Terapia de Substituição Renal (72 horas)", month: "agosto/2025", type: "Matéria", reach: 7327, interactions: 384, engagement: 5.24 },
  { id: "p55", title: "Doação de Órgãos", month: "agosto/2025", type: "Reels", reach: 143106, interactions: 7307, engagement: 5.11 },
  { id: "p56", title: "Dra. Juliana, Dr. Pedro, Dr. Gabriel - Desafio Residentes", month: "agosto/2025", type: "Matéria", reach: 9805, interactions: 484, engagement: 4.94 },
  { id: "p57", title: "Podcast Agosto (7)", month: "agosto/2025", type: "Podcast", reach: 2900, interactions: 141, engagement: 4.86 },
  { id: "p58", title: "Dia do Angiologista e Cirurgião Vascular - CSSJD", month: "agosto/2025", type: "Data Comemorativa", reach: 9956, interactions: 468, engagement: 4.70 },
  { id: "p59", title: "Dia da Gestante", month: "agosto/2025", type: "Data Comemorativa", reach: 7590, interactions: 332, engagement: 4.37 },
  { id: "p60", title: "Aulas de Língua Brasileira de Sinais para colaboradores", month: "agosto/2025", type: "Matéria", reach: 3601, interactions: 156, engagement: 4.33 },

  // --- ACUMULADOS / RECORRENTTES ---
  { id: "p61", title: "Podcast - Dr. Júlio Veloso (Junho-Acumulado)", month: "junho/2025", type: "Podcast", reach: 16268, interactions: 933, engagement: 5.73 },
  { id: "p62", title: "Dia Nacional Alerta Insuficiência Cardíaca (Acumulado)", month: "julho/2025", type: "Reels", reach: 16522, interactions: 946, engagement: 5.73 },
  { id: "p63", title: "Podcast com a Dayse (Acumulado)", month: "junho/2025", type: "Podcast", reach: 16775, interactions: 959, engagement: 5.72 },
  { id: "p64", title: "Podcast com Elis Regina - Compliance (Acumulado)", month: "julho/2025", type: "Podcast", reach: 17029, interactions: 973, engagement: 5.71 },
  { id: "p65", title: "Podcast com Elis Regina - Compliance (Acumulado 2)", month: "julho/2025", type: "Podcast", reach: 17283, interactions: 986, engagement: 5.70 },

  // --- SETEMBRO 2025 ---
  { id: "p66", title: "Dia dos médicos emergencistas - Dra. Laura Rabelo", month: "setembro/2025", type: "Data Comemorativa", reach: 5919, interactions: 400, engagement: 6.76 },
  { id: "p67", title: "Dia do Médico Residente - Dra. Sarah Fonseca", month: "setembro/2025", type: "Data Comemorativa", reach: 10850, interactions: 672, engagement: 6.19 },
  { id: "p68", title: "Dia do urologista - Equipe CSSJD", month: "setembro/2025", type: "Data Comemorativa", reach: 13780, interactions: 783, engagement: 5.68 },
  { id: "p69", title: "Dia dos Nutricionistas - Reconhecimento", month: "setembro/2025", type: "Data Comemorativa", reach: 11987, interactions: 566, engagement: 4.72 },
  { id: "p70", title: "Podcast Setembro", month: "setembro/2025", type: "Podcast", reach: 32439, interactions: 1518, engagement: 4.68 },
  { id: "p71", title: "Inauguração do Setor 4 - radio_sucessofm", month: "setembro/2025", type: "Reels", reach: 38794, interactions: 1727, engagement: 4.45 },
  { id: "p72", title: "Inauguração do Setor 4 - CSSJD", month: "setembro/2025", type: "Reels", reach: 8334, interactions: 370, engagement: 4.44 },
  { id: "p73", title: "Dia do Radioterapeuta - Alessandro Franciscon", month: "setembro/2025", type: "Data Comemorativa", reach: 6174, interactions: 255, engagement: 4.13 },
  { id: "p74", title: "Setembro Verde - portalgerais", month: "setembro/2025", type: "Reels", reach: 16094, interactions: 586, engagement: 3.64 },
  { id: "p75", title: "Vagas Setembro", month: "setembro/2025", type: "Vagas", reach: 18678, interactions: 538, engagement: 2.88 },
  { id: "p76", title: "Dia Nacional de Luta da Pessoa com Deficiência", month: "setembro/2025", type: "Data Comemorativa", reach: 16905, interactions: 396, engagement: 2.34 },
  { id: "p77", title: "Vagas Setembro (2)", month: "setembro/2025", type: "Vagas", reach: 11740, interactions: 241, engagement: 2.05 },
  { id: "p78", title: "Story Luto", month: "setembro/2025", type: "Story", reach: 7039, interactions: 82, engagement: 1.16 },
  { id: "p79", title: "Vagas Setembro (3)", month: "setembro/2025", type: "Vagas", reach: 7977, interactions: 76, engagement: 0.95 },
  { id: "p80", title: "Dia do Urologista - Dr. Celso Carlos", month: "setembro/2025", type: "Data Comemorativa", reach: 11264, interactions: 80, engagement: 0.71 },
  { id: "p81", title: "Story - Aniversário Paciente", month: "setembro/2025", type: "Story", reach: 6704, interactions: 47, engagement: 0.70 },
  { id: "p82", title: "Story - Orgulho de Ser Divinopolitano 1", month: "setembro/2025", type: "Story", reach: 6663, interactions: 34, engagement: 0.51 },
  { id: "p83", title: "Story - Orgulho de Ser Divinopolitano 2", month: "setembro/2025", type: "Story", reach: 13616, interactions: 62, engagement: 0.46 },
  { id: "p84", title: "Story - Orgulho de Ser Divinopolitano 3", month: "setembro/2025", type: "Story", reach: 6524, interactions: 27, engagement: 0.41 },
  { id: "p85", title: "Story - Orgulho de Ser Divinopolitano 4", month: "setembro/2025", type: "Story", reach: 11443, interactions: 33, engagement: 0.29 },

  // --- OUTUBRO 2025 ---
  { id: "p86", title: "História do Estevan", month: "outubro/2025", type: "Reels", reach: 39465, interactions: 6909, engagement: 17.51 },
  { id: "p87", title: "Paciente Cássio", month: "outubro/2025", type: "Reels", reach: 50376, interactions: 4444, engagement: 8.82 },
  { id: "p88", title: "Paciente Refaces", month: "outubro/2025", type: "Reels", reach: 20584, interactions: 2007, engagement: 9.75 },
  { id: "p89", title: "UTI: Touca Maluca", month: "outubro/2025", type: "Matéria", reach: 16281, interactions: 1000, engagement: 6.14 },
  { id: "p90", title: "Dia do Médico", month: "outubro/2025", type: "Data Comemorativa", reach: 12671, interactions: 972, engagement: 7.67 },
  { id: "p91", title: "Dr. Danilo - Riscos do Metanol", month: "outubro/2025", type: "Reels", reach: 6430, interactions: 819, engagement: 12.74 },
  { id: "p92", title: "Dia do Anestesiologista", month: "outubro/2025", type: "Data Comemorativa", reach: 17104, interactions: 779, engagement: 4.55 },
  { id: "p93", title: "Última quimioterapia", month: "outubro/2025", type: "Reels", reach: 8165, interactions: 757, engagement: 9.27 },
  { id: "p94", title: "Podcast Dra. Roseli", month: "outubro/2025", type: "Podcast", reach: 7300, interactions: 689, engagement: 9.44 },
  { id: "p95", title: "Depoimento da Colaboradora Vitória", month: "outubro/2025", type: "Reels", reach: 7541, interactions: 667, engagement: 8.84 },
  { id: "p96", title: "Débora e Dr. Júlio apresentando Aparelho", month: "outubro/2025", type: "Reels", reach: 6821, interactions: 575, engagement: 8.43 },
  { id: "p97", title: "Aniversário de um Paciente no setor 14", month: "outubro/2025", type: "Post", reach: 12758, interactions: 568, engagement: 4.45 },
  { id: "p98", title: "Podcast Dr. João Antônio - Camargos", month: "outubro/2025", type: "Podcast", reach: 5502, interactions: 472, engagement: 8.58 },
  { id: "p99", title: "Vagas Outubro", month: "outubro/2025", type: "Vagas", reach: 12233, interactions: 428, engagement: 3.50 },
  { id: "p100", title: "Dia do Ginecologista", month: "outubro/2025", type: "Data Comemorativa", reach: 11500, interactions: 426, engagement: 3.70 },
  { id: "p101", title: "Podcast Dra. Maria Eliza Machado Romeros", month: "outubro/2025", type: "Podcast", reach: 4734, interactions: 417, engagement: 8.81 },
  { id: "p102", title: "No Dia Mundial de Cuidados Paliativos", month: "outubro/2025", type: "Data Comemorativa", reach: 10377, interactions: 409, engagement: 3.94 },
  { id: "p103", title: "Dia Mundial do AVC", month: "outubro/2025", type: "Reels", reach: 5731, interactions: 344, engagement: 6.00 },
  { id: "p104", title: "Podcast Paciente", month: "outubro/2025", type: "Podcast", reach: 4173, interactions: 338, engagement: 8.10 },

  // --- NOVEMBRO 2025 ---
  { id: "p105", title: "1ª diálise contínua pediátrica", month: "novembro/2025", type: "Reels", reach: 14121, interactions: 1000, engagement: 7.08 },
  { id: "p106", title: "Dia dos médicos intensivistas", month: "novembro/2025", type: "Data Comemorativa", reach: 12705, interactions: 962, engagement: 7.57 },
  { id: "p107", title: "Dia Nacional de Prevenção das Arritmias Cardíacas", month: "novembro/2025", type: "Reels", reach: 7717, interactions: 612, engagement: 7.93 },
  { id: "p108", title: "Cuidados para o bebê prematuro - CSSJD", month: "novembro/2025", type: "Reels", reach: 9314, interactions: 568, engagement: 6.10 },
  { id: "p109", title: "Decoração de Natal no CSSJD", month: "novembro/2025", type: "Reels", reach: 7158, interactions: 562, engagement: 7.85 },
  { id: "p110", title: "Implantação do marcapasso sem eletrodos", month: "novembro/2025", type: "Reels", reach: 7334, interactions: 492, engagement: 6.71 },
  { id: "p111", title: "Dia Mundial da Pneumonia", month: "novembro/2025", type: "Reels", reach: 4211, interactions: 311, engagement: 7.39 },
  { id: "p112", title: "Webinar Dia D de Prevenção ao Câncer de Boca", month: "novembro/2025", type: "Matéria", reach: 7599, interactions: 296, engagement: 3.90 },
  { id: "p113", title: "Dra. Alice Cabral - Estágio no Instituto de Oncologia de Lisboa", month: "novembro/2025", type: "Matéria", reach: 5346, interactions: 292, engagement: 5.46 },
  { id: "p114", title: "Dia de Prevenção de Lesões por Pressão", month: "novembro/2025", type: "Reels", reach: 6163, interactions: 282, engagement: 4.58 },
  { id: "p115", title: "Dia dos intensivistas (Hospital)", month: "novembro/2025", type: "Data Comemorativa", reach: 15200, interactions: 260, engagement: 1.71 },
  { id: "p116", title: "Evento da Robótica", month: "novembro/2025", type: "Matéria", reach: 6987, interactions: 237, engagement: 3.39 },
  { id: "p117", title: "Cirurgias eletivas do SUS no Estado", month: "novembro/2025", type: "Matéria", reach: 5489, interactions: 223, engagement: 3.06 },
  { id: "p118", title: "Plasmaférese - Dr. André de Sá Vasconcelos", month: "novembro/2025", type: "Podcast", reach: 3477, interactions: 168, engagement: 4.83 },
  { id: "p119", title: "15º Congresso Brasileiro de AVC", month: "novembro/2025", type: "Matéria", reach: 2038, interactions: 158, engagement: 7.75 },
  { id: "p120", title: "Gratitude - Homenagem à equipe médica do CTI", month: "novembro/2025", type: "Gratitude", reach: 4541, interactions: 147, engagement: 3.24 },
  { id: "p121", title: "Dia do Radiologista", month: "novembro/2025", type: "Data Comemorativa", reach: 3961, interactions: 138, engagement: 3.48 },
  { id: "p122", title: "Palestra Câncer de Próstata - Consciência", month: "novembro/2025", type: "Matéria", reach: 3418, interactions: 135, engagement: 3.95 },
  { id: "p123", title: "Superintendente Regional de Saúde visita CSSJD", month: "novembro/2025", type: "Matéria", reach: 3920, interactions: 131, engagement: 3.34 },
  { id: "p124", title: "Simulados de Combate ao Incêndio", month: "novembro/2025", type: "Matéria", reach: 4578, interactions: 129, engagement: 2.82 },

  // --- DEZEMBRO 2025 ---
  { id: "p125", title: "Toquinhas temáticas de Natal para recém-nascidos", month: "dezembro/2025", type: "Matéria", reach: 24121, interactions: 1600, engagement: 6.63 },
  { id: "p126", title: "Última sessão de Quimioterapia da paciente Mirian", month: "dezembro/2025", type: "Reels", reach: 20930, interactions: 892, engagement: 4.26 },
  { id: "p127", title: "Liga da Alegria", month: "dezembro/2025", type: "Reels", reach: 15440, interactions: 784, engagement: 5.08 },
  { id: "p128", title: "Voluntárias Andress e Amanda - Presentes de Natal", month: "dezembro/2025", type: "Reels", reach: 18016, interactions: 509, engagement: 2.83 },
  { id: "p129", title: "Cardiologista Dr. Nelson Borges - Pressão Arterial", month: "dezembro/2025", type: "Reels", reach: 10797, interactions: 448, engagement: 4.15 },
  { id: "p130", title: "Padre Libério - Vida Venerável", month: "dezembro/2025", type: "Post", reach: 20772, interactions: 373, engagement: 1.80 },
  { id: "p131", title: "Dia do Palhaço - Doutores Palhaços em Divinópolis", month: "dezembro/2025", type: "Data Comemorativa", reach: 11815, interactions: 371, engagement: 3.14 },
  { id: "p132", title: "Elis Regina Guimarães - 100 Mais Influentes da Saúde", month: "dezembro/2025", type: "Matéria", reach: 11313, interactions: 331, engagement: 2.93 },
  { id: "p133", title: "Nutrição Clínica - Fiscalização do Conselho", month: "dezembro/2025", type: "Matéria", reach: 19281, interactions: 316, engagement: 1.64 },
  { id: "p134", title: "TBT Setor 04 (Lembranças)", month: "dezembro/2025", type: "Reels", reach: 8116, interactions: 306, engagement: 3.77 },
  { id: "p135", title: "Celebrar 2.0 (Story)", month: "dezembro/2025", type: "Story", reach: 15266, interactions: 249, engagement: 1.63 },
  { id: "p136", title: "Matéria sobre o Celebrar 2.0", month: "dezembro/2025", type: "Matéria", reach: 6434, interactions: 249, engagement: 3.87 },
  { id: "p137", title: "Giro de Obras - São João", month: "dezembro/2025", type: "Reels", reach: 6088, interactions: 243, engagement: 3.99 },
  { id: "p138", title: "CSSJD - Conquista Top of Mind 2025", month: "dezembro/2025", type: "Matéria", reach: 24556, interactions: 240, engagement: 0.98 },
  { id: "p139", title: "Dr. Marcelo Moreira Rezende - Cirurgia Cardiovascular", month: "dezembro/2025", type: "Matéria", reach: 15064, interactions: 226, engagement: 1.50 },
  { id: "p140", title: "Dra. Cecília Rotella e Dr. Antônio - Cirurgia Plástica", month: "dezembro/2025", type: "Data Comemorativa", reach: 20906, interactions: 220, engagement: 1.05 },
  { id: "p141", title: "Ética Games 4.0 - Competição", month: "dezembro/2025", type: "Matéria", reach: 16059, interactions: 213, engagement: 1.33 },
  { id: "p142", title: "Cafezinho Solidário - Voluntariado", month: "dezembro/2025", type: "Reels", reach: 7497, interactions: 209, engagement: 2.79 },
  { id: "p143", title: "Nutricionistas Izadora, Karina e Maria - Festas de Fim de Ano", month: "dezembro/2025", type: "Reels", reach: 7332, interactions: 207, engagement: 2.82 },
  { id: "p144", title: "Aniversário do Estado de Minas Gerais", month: "dezembro/2025", type: "Post", reach: 5253, interactions: 193, engagement: 3.67 },

  // --- JANEIRO 2026 ---
  { id: "p145", title: "Tarde de Louvor", month: "janeiro/2026", type: "Reels", reach: 6348, interactions: 546, engagement: 8.60 },
  { id: "p146", title: "Janeiro Branco - benefícios de trabalhar no CSSJD", month: "janeiro/2026", type: "Reels", reach: 8166, interactions: 673, engagement: 8.24 },
  { id: "p147", title: "Podcast da Elis Regina falando sobre Compliance", month: "janeiro/2026", type: "Podcast", reach: 3566, interactions: 239, engagement: 6.70 },
  { id: "p148", title: "Elis Regina sobre compliance (2)", month: "janeiro/2026", type: "Podcast", reach: 3601, interactions: 240, engagement: 6.66 },
  { id: "p149", title: "Podcast. O que o Psicólogo faz?", month: "janeiro/2026", type: "Podcast", reach: 2753, interactions: 180, engagement: 6.54 },
  { id: "p150", title: "Janeiro Branco - Psicólogo", month: "janeiro/2026", type: "Reels", reach: 3274, interactions: 206, engagement: 6.29 },
  { id: "p151", title: "Dra. Jussara Fontes - Cuidados com Pressão Arterial", month: "janeiro/2026", type: "Reels", reach: 3284, interactions: 195, engagement: 5.94 },
  { id: "p152", title: "Vídeo LGPD - Proteção de dados com Diretoria", month: "janeiro/2026", type: "Reels", reach: 3345, interactions: 197, engagement: 5.89 },
  { id: "p153", title: "Vídeo sobre doação múltipla de órgãos", month: "janeiro/2026", type: "Reels", reach: 4068, interactions: 237, engagement: 5.83 },
  { id: "p154", title: "Podcast - Aline Neves sobre Luto", month: "janeiro/2026", type: "Podcast", reach: 3329, interactions: 163, engagement: 4.90 },
  { id: "p155", title: "Podcast. Papel do Psicólogo na UTI", month: "janeiro/2026", type: "Podcast", reach: 3334, interactions: 163, engagement: 4.89 },
  { id: "p156", title: "Podcast sobre Perdas", month: "janeiro/2026", type: "Podcast", reach: 1514, interactions: 73, engagement: 4.82 },
  { id: "p157", title: "Linha de Cuidados do Infarto Agudo do Miocárdio", month: "janeiro/2026", type: "Podcast", reach: 2141, interactions: 100, engagement: 4.67 },
  { id: "p158", title: "Dr. Alex Couto Garcia - Linha de Cuidado IAM", month: "janeiro/2026", type: "Reels", reach: 2190, interactions: 95, engagement: 4.34 },
  { id: "p159", title: "Vagas Divulgadas", month: "janeiro/2026", type: "Vagas", reach: 15262, interactions: 613, engagement: 4.02 },
  { id: "p160", title: "Vagas - Várias em Aberto", month: "janeiro/2026", type: "Vagas", reach: 15243, interactions: 612, engagement: 4.01 },
  { id: "p161", title: "Agradecer (Marluce Xavier)", month: "janeiro/2026", type: "Reels", reach: 15272, interactions: 613, engagement: 4.01 },
  { id: "p162", title: "Vagas - TI, Saúde e ADM", month: "janeiro/2026", type: "Vagas", reach: 15272, interactions: 613, engagement: 4.01 },
  { id: "p163", title: "Matéria sobre treinamento de LGPD", month: "janeiro/2026", type: "Matéria", reach: 1925, interactions: 71, engagement: 3.69 },
  { id: "p164", title: "Três linhas de cuidado de Cardiologia - Dr. Alex Garcia", month: "janeiro/2026", type: "Podcast", reach: 1639, interactions: 60, engagement: 3.66 },

  // --- FEVEREIRO 2026 ---
  { id: "p165", title: "Solenidade de Formatura de Residentes CSSJD", month: "fevereiro/2026", type: "Matéria", reach: 1333, interactions: 229, engagement: 17.18 },
  { id: "p166", title: "Aniversário da Unidade de AVC", month: "fevereiro/2026", type: "Matéria", reach: 13212, interactions: 967, engagement: 7.32 },
  { id: "p167", title: "Formatura dos Residentes e Especializandos", month: "fevereiro/2026", type: "Reels", reach: 12984, interactions: 931, engagement: 7.17 },
  { id: "p168", title: "Missão, Visão e Valores Organizacionais", month: "fevereiro/2026", type: "Post", reach: 1430, interactions: 93, engagement: 6.50 },
  { id: "p169", title: "Podcast sobre Compliance - Ana", month: "fevereiro/2026", type: "Podcast", reach: 2360, interactions: 147, engagement: 6.23 },
  { id: "p170", title: "Giro de Obras", month: "fevereiro/2026", type: "Reels", reach: 3103, interactions: 190, engagement: 6.12 },
  { id: "p171", title: "Dia dos Mastologistas", month: "fevereiro/2026", type: "Data Comemorativa", reach: 7074, interactions: 363, engagement: 5.13 },
  { id: "p172", title: "Colab Portal Gerais - Dr. Antônio José", month: "fevereiro/2026", type: "Colab", reach: 8560, interactions: 416, engagement: 4.86 },
  { id: "p173", title: "Colab Jornal Agora - Formatura CSSJD", month: "fevereiro/2026", type: "Colab", reach: 15629, interactions: 724, engagement: 4.63 },
  { id: "p174", title: "Dia do cirurgião bucomaxilofacial", month: "fevereiro/2026", type: "Data Comemorativa", reach: 6432, interactions: 287, engagement: 4.46 },
  { id: "p175", title: "Podcast Compliance", month: "fevereiro/2026", type: "Podcast", reach: 2867, interactions: 113, engagement: 3.94 },
  { id: "p176", title: "Vagas TI, Enfermagem e Apoio", month: "fevereiro/2026", type: "Vagas", reach: 15286, interactions: 574, engagement: 3.76 },
  { id: "p177", title: "Cooperação Hospital São José - Planejamento Estratégico", month: "fevereiro/2026", type: "Colab", reach: 5929, interactions: 177, engagement: 2.99 },
  { id: "p178", title: "Reels - Carnaval CSSJD com Alegria", month: "fevereiro/2026", type: "Reels", reach: 3001, interactions: 88, engagement: 2.93 },
  { id: "p179", title: "Dia Mundial do Câncer", month: "fevereiro/2026", type: "Post", reach: 5242, interactions: 152, engagement: 2.90 },
  { id: "p180", title: "Carnaval e Saúde Hospitalar", month: "fevereiro/2026", type: "Matéria", reach: 5247, interactions: 140, engagement: 2.67 },
  { id: "p181", title: "Colab Divinews - Formatura de Residentes", month: "fevereiro/2026", type: "Colab", reach: 16764, interactions: 363, engagement: 2.17 },
  { id: "p182", title: "Colab Portal Gerais - Formatura CSSJD", month: "fevereiro/2026", type: "Colab", reach: 7270, interactions: 138, engagement: 1.90 },
  { id: "p183", title: "Solidariedade pela colaboradora Ana Luiza", month: "fevereiro/2026", type: "Story", reach: 8765, interactions: 151, engagement: 1.72 },
  { id: "p184", title: "Mastologistas - Dia do Profissional", month: "fevereiro/2026", type: "Data Comemorativa", reach: 7290, interactions: 115, engagement: 1.58 },

  // --- MARÇO 2026 ---
  { id: "p185", title: "Visita do Ministro da Saúde ao CSSJD", month: "março/2026", type: "Reels", reach: 7064, interactions: 2143, engagement: 30.34 },
  { id: "p186", title: "Revista Xeque Mate destaca CSSJD", month: "março/2026", type: "Matéria", reach: 3941, interactions: 385, engagement: 9.77 },
  { id: "p187", title: "Dia do Médico Clínico", month: "março/2026", type: "Data Comemorativa", reach: 17451, interactions: 1069, engagement: 6.13 },
  { id: "p188", title: "Homenagem ao dia de São João de Deus", month: "março/2026", type: "Data Comemorativa", reach: 4105, interactions: 251, engagement: 6.11 },
  { id: "p189", title: "Parceria e Aniversário ACOM", month: "março/2026", type: "Post", reach: 3578, interactions: 192, engagement: 5.37 },
  { id: "p190", title: "CSSJD na prestigiada revista Newsweek", month: "março/2026", type: "Matéria", reach: 8945, interactions: 400, engagement: 4.47 },
  { id: "p191", title: "Cidadania Honorária entregue à diretora Elis Regina Guimarães", month: "março/2026", type: "Matéria", reach: 3423, interactions: 151, engagement: 4.41 },
  { id: "p192", title: "Comissão de Ética em Enfermagem - Destaques", month: "março/2026", type: "Matéria", reach: 4332, interactions: 158, engagement: 3.65 },
  { id: "p193", title: "Evento de Ética Profissional - Isabelly Ramos Justo", month: "março/2026", type: "Matéria", reach: 4332, interactions: 158, engagement: 3.65 },
  { id: "p194", title: "Histórico Mutirão Saúde da Mulher no Hospital", month: "março/2026", type: "Post", reach: 8454, interactions: 236, engagement: 2.79 },
  { id: "p195", title: "Dia do Otorrinolaringologista", month: "março/2026", type: "Data Comemorativa", reach: 3264, interactions: 84, engagement: 2.57 },
  { id: "p196", title: "Encontro Científico Fora de Sede", month: "março/2026", type: "Matéria", reach: 10760, interactions: 259, engagement: 2.41 },
  { id: "p197", title: "Vagas Disponibilizadas", month: "março/2026", type: "Vagas", reach: 12617, interactions: 302, engagement: 2.39 },
  { id: "p198", title: "Resultados Saúde da Mulher - Pós Mutirão", month: "março/2026", type: "Post", reach: 4017, interactions: 83, engagement: 2.07 },
  { id: "p199", title: "Ministro Adjunto Adriano Massuda visita CSSJD (Story)", month: "março/2026", type: "Story", reach: 4157, interactions: 69, engagement: 1.66 },
  { id: "p200", title: "Treinamentos Integrados Fono e Nutricionista", month: "março/2026", type: "Story", reach: 4138, interactions: 39, engagement: 0.94 },
  { id: "p201", title: "Bloco Cirúrgico - Implante Transcateter Válvula Aórtica", month: "março/2026", type: "Story", reach: 5765, interactions: 43, engagement: 0.75 },
  { id: "p202", title: "Título Honorário (Story)", month: "março/2026", type: "Story", reach: 3154, interactions: 20, engagement: 0.63 },
  { id: "p203", title: "Título Honorário - Parte 2 (Story)", month: "março/2026", type: "Story", reach: 3355, interactions: 18, engagement: 0.54 },
  { id: "p204", title: "Representação CSSJD na Assembleia da CMB", month: "março/2026", type: "Matéria", reach: 4541, interactions: 20, engagement: 0.44 },

  // --- ABRIL 2026 ---
  { id: "p205", title: "Colab - Projeto Onco +", month: "abril/2026", type: "Colab", reach: 168, interactions: 185, engagement: 110.12 },
  { id: "p206", title: "Colab Conquista Selo Top Performer", month: "abril/2026", type: "Colab", reach: 883, interactions: 717, engagement: 81.20 },
  { id: "p207", title: "Dia Mundial da Voz", month: "abril/2026", type: "Reels", reach: 385, interactions: 282, engagement: 73.25 },
  { id: "p208", title: "Giro de Obras", month: "abril/2026", type: "Reels", reach: 263, interactions: 189, engagement: 71.86 },
  { id: "p209", title: "Plano de Contingência diante de Greve", month: "abril/2026", type: "Reels", reach: 1815, interactions: 1284, engagement: 70.74 },
  { id: "p210", title: "Giro de Obras em Andamento", month: "abril/2026", type: "Reels", reach: 300, interactions: 99, engagement: 33.00 },
  { id: "p211", title: "Colab sobre Voluntariado no CSSJD", month: "abril/2026", type: "Colab", reach: 4744, interactions: 443, engagement: 9.34 },
  { id: "p212", title: "Dia do Neurocirurgião", month: "abril/2026", type: "Data Comemorativa", reach: 7062, interactions: 531, engagement: 7.52 },
  { id: "p213", title: "Conclusão de Mestrado de Colaborador", month: "abril/2026", type: "Matéria", reach: 6856, interactions: 442, engagement: 6.45 },
  { id: "p214", title: "Conquista Acadêmica de Farmacêutica", month: "abril/2026", type: "Matéria", reach: 6453, interactions: 361, engagement: 5.59 },
  { id: "p215", title: "Colab - Projeto Onco + (Tutorias)", month: "abril/2026", type: "Colab", reach: 7626, interactions: 378, engagement: 4.96 },
  { id: "p216", title: "Colab - Projeto Onco + (Inovação)", month: "abril/2026", type: "Colab", reach: 3274, interactions: 153, engagement: 4.67 },
  { id: "p217", title: "Colab - Projeto Onco + (Apoio)", month: "abril/2026", type: "Colab", reach: 6154, interactions: 285, engagement: 4.63 },
  { id: "p218", title: "Colab - Projeto Onco + (Equipe)", month: "abril/2026", type: "Colab", reach: 3168, interactions: 140, engagement: 4.42 },
  { id: "p219", title: "Mensagem de Páscoa Institucional", month: "abril/2026", type: "Post", reach: 904, interactions: 38, engagement: 4.20 },
  { id: "p220", title: "Vagas Abertas Abril", month: "abril/2026", type: "Vagas", reach: 12486, interactions: 514, engagement: 4.12 },
  { id: "p221", title: "Semana Mundial da Imunização", month: "abril/2026", type: "Matéria", reach: 3250, interactions: 131, engagement: 4.03 },
  { id: "p222", title: "Colab - Câncer de Mama Metaplásico", month: "abril/2026", type: "Colab", reach: 6926, interactions: 233, engagement: 3.36 },
  { id: "p223", title: "Dia do Médico Obstetra - Gestações", month: "abril/2026", type: "Data Comemorativa", reach: 9540, interactions: 297, engagement: 3.11 },
  { id: "p224", title: "Seminário Acolher para Transformar", month: "abril/2026", type: "Matéria", reach: 1489, interactions: 46, engagement: 3.09 }
];
