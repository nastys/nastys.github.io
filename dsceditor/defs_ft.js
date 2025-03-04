/*
  DSC Studio
  Copyright (C) 2022-2025 nastys

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
// params re'd by korenkonder
const mappingHandAnimFt =
{
     0: "CMN_HAND_OPEN",
     1: "CMN_HAND_CLOSE",
     2: "CMN_HAND_NORMAL",
     3: "CMN_HAND_PEACE",
     4: "CMN_HAND_NEGI",
     5: "CMN_HAND_MIC",
     6: "CMN_HAND_ONE",
     7: "CMN_HAND_SIZEN",
     8: "CMN_HAND_PICK",
     9: "(null)",
    10: "CMN_HAND_THREE",
    11: "CMN_HAND_MIC",
    12: "CMN_HAND_MIC",
    13: "CMN_HAND_MIC",
    14: "CMN_HAND_RESET",
};

const mappingExpressionFt =
{
     0: "FACE_SAD",
     1: "FACE_LAUGH",
     2: "FACE_CRY",
     3: "FACE_SURPRISE",
     4: "FACE_WINK_OLD",
     5: "FACE_ADMIRATION",
     6: "FACE_SMILE",
     7: "FACE_SETTLED",
     8: "FACE_DAZZLING",
     9: "FACE_LASCIVIOUS",
    10: "FACE_STRONG",
    11: "FACE_CLARIFYING",
    12: "FACE_GENTLE",
    13: "FACE_NAGASI",
    14: "FACE_RESET",
    15: "FACE_KIRI",
    16: "FACE_UTURO",
    17: "FACE_OMOU",
    18: "FACE_SETUNA",
    19: "FACE_GENKI",
    20: "FACE_YARU",
    21: "FACE_RESET",
    22: "FACE_CLOSE",
    23: "(null)",
    24: "FACE MOT INDEX 0",
    25: "FACE MOT INDEX 1",
    26: "FACE MOT INDEX 2",
    27: "FACE MOT INDEX 3",
    28: "FACE MOT INDEX 4",
    29: "FACE MOT INDEX 5",
    30: "FACE MOT INDEX 6",
    31: "FACE MOT INDEX 7",
    32: "FACE MOT INDEX 8",
    33: "FACE MOT INDEX 9",
    34: "FACE_COOL",
    35: "FACE_KOMARIWARAI",
    36: "FACE_KUMON",
    37: "FACE_KUTSUU",
    38: "FACE_NAKI",
    39: "FACE_NAYAMI",
    40: "FACE_SUPSERIOUS",
    41: "FACE_TSUYOKIWARAI",
    42: "FACE_WINK_L",
    43: "FACE_WINK_R",
    44: "FACE_WINKG_L",
    45: "FACE_WINKG_R",
    46: "FACE_RESET",
    47: "FACE_RESET",
    48: "FACE_RESET",
    49: "FACE_RESET",
    50: "FACE_RESET",
    51: "FACE_WINK_OLD",
    52: "FACE_SAD_OLD",
    53: "FACE_SURPRISE_OLD",
    54: "FACE_SMILE_OLD",
    55: "FACE_DAZZLING_OLD",
    56: "FACE_LASCIVIOUS_OLD",
    57: "FACE_STRONG_OLD",
    58: "FACE_CLARIFYING_OLD",
    59: "FACE_GENTLE_OLD",
    60: "FACE_NAGASI_OLD",
    61: "FACE_KIRI_OLD",
    62: "FACE_OMOU_OLD",
    63: "FACE_SETUNA_OLD",
    64: "FACE_NEW_IKARI_OLD",
    65: "FACE_CRY_OLD",
    66: "FACE_LAUGH_OLD",
    67: "FACE_YARU_OLD",
    68: "FACE_ADMIRATION_OLD",
    69: "FACE_GENKI_OLD",
    70: "FACE_SETTLED_OLD",
    71: "FACE_UTURO_OLD",
    72: "FACE_RESET_OLD",
    73: "FACE_CLOSE_OLD",
    74: "FACE_EYEBROW_UP_RIGHT",
    75: "FACE_EYEBROW_UP_LEFT",
    76: "FACE_KOMARIEGAO",
    77: "FACE_KONWAKU",
};

const mappingLookAnimFt =
{
     0: "CMN_EYES_UP",
     1: "CMN_EYES_DOWN",
     2: "CMN_EYES_RIGHT",
     3: "CMN_EYES_LEFT",
     4: "CMN_EYES_UP_RIGHT",
     5: "CMN_EYES_UP_LEFT",
     6: "CMN_EYES_DOWN_RIGHT",
     7: "CMN_EYES_DOWN_LEFT",
     8: "CMN_EYES_RESET",
     9: "(null)",
    10: "[use look anim from mot file]",
    11: "EYES_UP_OLD",
    12: "EYES_DOWN_OLD",
    13: "EYES_RIGHT_OLD",
    14: "EYES_LEFT_OLD",
    15: "EYES_UP_RIGHT_OLD",
    16: "EYES_UP_LEFT_OLD",
    17: "EYES_DOWN_RIGHT_OLD",
    18: "EYES_DOWN_LEFT_OLD",
    19: "EYES_RESET_OLD",
};

const mappingMouthAnimFt = 
{
     0: "KUCHI_A",
     1: "KUCHI_E",
     2: "KUCHI_O",
     3: "KUCHI_SURPRISE",
     4: "KUCHI_HE",
     5: "KUCHI_SMILE",
     6: "KUCHI_NIYA",
     7: "KUCHI_CHU",
     8: "KUCHI_RESET",
     9: "KUCHI_RESET_OLD",
    10: "KUCHI_I",
    11: "KUCHI_U",
    12: "KUCHI_E_DOWN",
    13: "KUCHI_HAMISE",
    14: "KUCHI_HAMISE_DOWN",
    15: "KUCHI_HE_S",
    16: "KUCHI_HERAHERA",
    17: "KUCHI_MOGUMOGU",
    18: "KUCHI_NEKO",
    19: "KUCHI_SAKEBI",
    20: "KUCHI_SAKEBI_L",
    21: "KUCHI_SMILE_L",
    22: "KUCHI_NEUTRAL",
    23: "KUCHI_NIYA_OLD",
    24: "KUCHI_A_OLD",
    25: "KUCHI_O_OLD",
    26: "KUCHI_SURPRISE_OLD",
    27: "KUCHI_HE_OLD",
    28: "KUCHI_RESET_OLD",
    29: "KUCHI_I_OLD",
    30: "KUCHI_U_OLD",
    31: "KUCHI_E_OLD",
    32: "KUCHI_SMILE_OLD",
    33: "KUCHI_CHU_OLD",
    34: "KUCHI_PSP_A",
    35: "KUCHI_PSP_E",
    36: "KUCHI_PSP_O",
    37: "KUCHI_PSP_SURPRISE",
    38: "KUCHI_PSP_NIYA",
    39: "KUCHI_PSP_NIYARI",
    40: "KUCHI_HAMISE_E",
    41: "KUCHI_SANKAKU",
    42: "KUCHI_SHIKAKU",
};

const mappingBranchFt =
{
    0: "Global",
    1: "Failure",
    2: "Success",
};