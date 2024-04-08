import {
  BRAZILIAN_104,
  BRAZILIAN_104_FULL,
  JAPANESE_106,
  JAPANESE_106_FULL,
  KOREAN_103,
  KOREAN_103_FULL,
  MATRIX,
  STANDARD_101,
  STANDARD_101_FULL,
  STANDARD_102,
  STANDARD_102_FULL,
} from "./data/geometry.ts";
import {
  LAYOUT_BE_BY_WIN,
  LAYOUT_CS_CZ_WIN,
  LAYOUT_DE_BONE,
  LAYOUT_DE_CH_WIN,
  LAYOUT_DE_DE_WIN,
  LAYOUT_DE_MINE,
  LAYOUT_DE_NEO_2,
  LAYOUT_DE_NOTED,
  LAYOUT_EL_GR_WIN,
  LAYOUT_EN_CANARY,
  LAYOUT_EN_CANARY_MATRIX,
  LAYOUT_EN_COLEMAK,
  LAYOUT_EN_COLEMAK_DH,
  LAYOUT_EN_COLEMAK_DH_MATRIX,
  LAYOUT_EN_DVORAK_WIN,
  LAYOUT_EN_UK_WIN,
  LAYOUT_EN_US_WIN,
  LAYOUT_EN_WORKMAN,
  LAYOUT_ES_ES_WIN,
  LAYOUT_FR_BEPO,
  LAYOUT_FR_CA_WIN,
  LAYOUT_FR_CH_WIN,
  LAYOUT_FR_ERGLACE,
  LAYOUT_FR_ERGO_L,
  LAYOUT_FR_FR_WIN,
  LAYOUT_FR_OPTIMOT_ERGO,
  LAYOUT_HE_IL_WIN,
  LAYOUT_HU_HU_WIN,
  LAYOUT_IT_IT_WIN,
  LAYOUT_JA_JP_JIS,
  LAYOUT_NB_NO_WIN,
  LAYOUT_NL_BE_WIN,
  LAYOUT_NL_NL_WIN,
  LAYOUT_PL_PL_WIN,
  LAYOUT_PT_BR_WIN,
  LAYOUT_PT_PT_WIN,
  LAYOUT_RU_RU_WIN,
  LAYOUT_SL_SI_WIN,
  LAYOUT_SV_SE_WIN,
  LAYOUT_TR_TR_F_WIN,
  LAYOUT_TR_TR_Q_WIN,
  LAYOUT_UK_UA_WIN,
} from "./data/layout.ts";
import { Geometry } from "./geometry.ts";
import { Keyboard } from "./keyboard.ts";
import { Layout } from "./layout.ts";
import { KeyboardOptions } from "./settings.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

const layoutDict = new Map<Layout, CodePointDict>([
  [Layout.BE_BY, LAYOUT_BE_BY_WIN],
  [Layout.CS_CZ, LAYOUT_CS_CZ_WIN],
  [Layout.DE_BONE, LAYOUT_DE_BONE],
  [Layout.DE_CH, LAYOUT_DE_CH_WIN],
  [Layout.DE_DE, LAYOUT_DE_DE_WIN],
  [Layout.DE_MINE, LAYOUT_DE_MINE],
  [Layout.DE_NEO_2, LAYOUT_DE_NEO_2],
  [Layout.DE_NOTED, LAYOUT_DE_NOTED],
  [Layout.EL_GR, LAYOUT_EL_GR_WIN],
  [Layout.EN_CANARY, LAYOUT_EN_CANARY],
  [Layout.EN_CANARY_MATRIX, LAYOUT_EN_CANARY_MATRIX],
  [Layout.EN_COLEMAK, LAYOUT_EN_COLEMAK],
  [Layout.EN_COLEMAK_DH, LAYOUT_EN_COLEMAK_DH],
  [Layout.EN_COLEMAK_DH_MATRIX, LAYOUT_EN_COLEMAK_DH_MATRIX],
  [Layout.EN_DVORAK, LAYOUT_EN_DVORAK_WIN],
  [Layout.EN_JP, LAYOUT_JA_JP_JIS],
  [Layout.EN_UK, LAYOUT_EN_UK_WIN],
  [Layout.EN_US, LAYOUT_EN_US_WIN],
  [Layout.EN_WORKMAN, LAYOUT_EN_WORKMAN],
  [Layout.ES_ES, LAYOUT_ES_ES_WIN],
  [Layout.FR_BEPO, LAYOUT_FR_BEPO],
  [Layout.FR_CA, LAYOUT_FR_CA_WIN],
  [Layout.FR_CH, LAYOUT_FR_CH_WIN],
  [Layout.FR_ERGLACE, LAYOUT_FR_ERGLACE],
  [Layout.FR_ERGO_L, LAYOUT_FR_ERGO_L],
  [Layout.FR_FR, LAYOUT_FR_FR_WIN],
  [Layout.FR_OPTIMOT_ERGO, LAYOUT_FR_OPTIMOT_ERGO],
  [Layout.HE_IL, LAYOUT_HE_IL_WIN],
  [Layout.HU_HU, LAYOUT_HU_HU_WIN],
  [Layout.IT_IT, LAYOUT_IT_IT_WIN],
  [Layout.NB_NO, LAYOUT_NB_NO_WIN],
  [Layout.NL_BE, LAYOUT_NL_BE_WIN],
  [Layout.NL_NL, LAYOUT_NL_NL_WIN],
  [Layout.PL_PL, LAYOUT_PL_PL_WIN],
  [Layout.PT_BR, LAYOUT_PT_BR_WIN],
  [Layout.PT_PT, LAYOUT_PT_PT_WIN],
  [Layout.RU_RU, LAYOUT_RU_RU_WIN],
  [Layout.SL_SI, LAYOUT_SL_SI_WIN],
  [Layout.SV_SE, LAYOUT_SV_SE_WIN],
  [Layout.TR_TR_F, LAYOUT_TR_TR_F_WIN],
  [Layout.TR_TR_Q, LAYOUT_TR_TR_Q_WIN],
  [Layout.UK_UA, LAYOUT_UK_UA_WIN],
]);

const geometryDict = new Map<Geometry, GeometryDict>([
  [Geometry.BRAZILIAN_104, BRAZILIAN_104],
  [Geometry.BRAZILIAN_104_FULL, BRAZILIAN_104_FULL],
  [Geometry.JAPANESE_106, JAPANESE_106],
  [Geometry.JAPANESE_106_FULL, JAPANESE_106_FULL],
  [Geometry.KOREAN_103, KOREAN_103],
  [Geometry.KOREAN_103_FULL, KOREAN_103_FULL],
  [Geometry.MATRIX, MATRIX],
  [Geometry.STANDARD_101, STANDARD_101],
  [Geometry.STANDARD_101_FULL, STANDARD_101_FULL],
  [Geometry.STANDARD_102, STANDARD_102],
  [Geometry.STANDARD_102_FULL, STANDARD_102_FULL],
]);

export function loadKeyboard(options: KeyboardOptions): Keyboard;
export function loadKeyboard(layout: Layout): Keyboard;
export function loadKeyboard(layout: Layout, geometry: Geometry): Keyboard;
export function loadKeyboard(...args: any[]): Keyboard {
  const l = args.length;
  let options: KeyboardOptions, layout: Layout, geometry: Geometry;
  if (l === 1 && (options = args[0]) instanceof KeyboardOptions) {
    const { layout, geometry } = options;
    return loadImpl(layout, geometry);
  }
  if (l === 1 && (layout = args[0]) instanceof Layout) {
    const [geometry] = layout.geometries;
    return loadImpl(layout, geometry);
  }
  if (
    l === 2 &&
    (layout = args[0]) instanceof Layout &&
    (geometry = args[1]) instanceof Geometry
  ) {
    return loadImpl(layout, geometry);
  }
  throw new TypeError();
}

function loadImpl(layout: Layout, geometry: Geometry): Keyboard {
  return new Keyboard(
    layout,
    layoutDict.get(layout)!,
    geometryDict.get(geometry)!,
  );
}
