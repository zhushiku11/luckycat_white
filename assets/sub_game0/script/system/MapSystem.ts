import { AssetManager, assetManager, JsonAsset, log, Size, TERRAIN_MAX_LAYER_COUNT, v2, v3 } from "cc";


export type IMapData = {
    itemTotalNum: number, // tile总数
    width: number, // 地图宽度
    height: number, // 地图高度
    time: number, // 游戏时间
    tileWidth: number, // tile宽度
    tileHeight: number, // tile高度
    data: number[][], // 地图数据
}

export class MapSystem {

    public static readonly maxTileWidth = 81;
    public static readonly maxTileHeight = 111;
    public static readonly maxTileIconWidth = 81;
    public static readonly maxTileIconHeight = 111;
    public static readonly maxTileTypeCount = 10;
    public static readonly eliminateLimit = 2;
    public static tileWidth = 0;
    public static tileHeight = 0;
    public static tileScale = 0;
    private static maxMapWidth = 718;
    private static maxMapHeight = 305;

    // 地图配置信息
    private static mapConfig = null;

    public static async init() {
        await MapSystem.loadAllMapData();
    }

    public static setMaxRect(width: number, height: number) {
        this.maxMapWidth = width;
        this.maxMapHeight = height;
    }

    public static getTileIconSize(scale: number) {
        return new Size(this.maxTileIconWidth * scale, this.maxTileIconHeight * scale);
    }

    // 栅格地图大小 转 像素大小
    public static toMapSize(mapW: number, mapH: number) {
        return new Size(mapW * MapSystem.tileWidth, mapH * MapSystem.tileHeight);
    }

    // 栅格坐标 转 像素坐标
    public static toPosition(mapX: number, mapY: number) {
        let posX = mapX * 91 - this.maxMapWidth * 0.5 + MapSystem.tileWidth * 0.5;
        let posY = mapY * 55 - 140;
        return v3(posX, posY, 0);
    }

    // 像素坐标 转 地图坐标
    public static toMapXYByWH(posX: number, posY: number, mapW: number, mapH: number) {
        return v2(Math.floor((posX + 0.5 * mapW * MapSystem.tileWidth) / MapSystem.tileWidth), Math.floor((posY + 0.5 * mapH * MapSystem.tileHeight) / MapSystem.tileHeight));
    }c

    // 像素坐标 转 地图坐标
    public static toMapXY(posX: number, posY: number, mapWidht: number, mapHeight: number) {
        return v2(Math.floor((posX + 0.5 * mapWidht) / MapSystem.tileWidth), Math.floor((posY + 0.5 * mapHeight) / MapSystem.tileHeight));
    }

    // 本地获取关卡数据
    public static async loadAllMapData() {
        // let url = `data/allLevel${1}`;
        // console.log("Load map :", url);
        // await AssetsDB.load([url], JsonAsset, null, RES_NAME);
        // let data = AssetsDB.get<JsonAsset>(url, RES_NAME);
        // MapSystem.mapConfig = data.json;
        // console.log("MapSystem.mapConfig", MapSystem.mapConfig);

        let mapConfig = {
            // "0": [[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1]],
            "0": [
                [0, 0, 0, 0, 0, 5, 5, 0],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [5, 5, 1, 1, 5, 2, 4, 5],
                [5, 5, 1, 1, 5, 2, 4, 4],
                [5, 5, 5, 1, 1, 2, 2, 4]
            ],
            "1": [
                [0, 0, 0, 0, 0, 5, 5, 0],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [5, 5, 1, 1, 5, 2, 4, 5],
                [5, 5, 1, 1, 5, 2, 4, 4],
                [5, 5, 5, 1, 1, 2, 2, 4]
            ],
            "2": [
                [1, 1, 1, 3, 0, 3, 0, 1],
                [1, 4, 3, 4, 4, 3, 3, 1],
                [1, 4, 3, 1, 2, 1, 4, 1],
                [4, 4, 3, 4, 2, 1, 4, 1],
                [3, 3, 3, 3, 4, 4, 3, 4],
                [4, 4, 4, 2, 2, 4, 2, 4],
                [1, 4, 3, 1, 2, 1, 4, 1],
                [4, 4, 3, 4, 2, 1, 2, 1],
                [3, 3, 3, 3, 4, 4, 2, 4],
                [4, 4, 4, 2, 2, 4, 2, 4]
            ],
            "3": [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 2, 5, 1, 6, 6],
                [7, 5, 2, 2, 5, 5, 6, 6],
                [5, 5, 5, 2, 5, 5, 6, 6],
                [7, 5, 5, 2, 5, 4, 4, 4],
                [7, 7, 3, 3, 2, 1, 4, 4],
                [7, 7, 3, 3, 1, 1, 4, 1],
                [6, 6, 3, 3, 1, 1, 1, 1],
                [6, 6, 6, 4, 1, 3, 1, 1],
                [2, 4, 6, 4, 7, 3, 7, 1],
                [2, 4, 2, 4, 7, 3, 7, 3],
                [2, 4, 2, 2, 7, 7, 3, 3]
            ],
            "4": [
                [10, 10, 10, 10, 10, 10, 10, 10],
                [10, 10, 4, 4, 3, 3, 10, 10],
                [2, 3, 4, 4, 10, 3, 10, 10],
                [2, 3, 4, 9, 3, 10, 10, 10],
                [2, 9, 4, 9, 3, 3, 10, 5],
                [2, 9, 3, 9, 5, 6, 5, 6],
                [9, 9, 3, 3, 5, 6, 5, 6],
                [9, 6, 10, 3, 5, 6, 6, 6],
                [2, 6, 10, 10, 7, 10, 6, 6],
                [2, 6, 7, 7, 7, 10, 8, 8],
                [9, 1, 7, 7, 10, 10, 8, 8],
                [9, 1, 10, 10, 10, 7, 8, 2],
                [9, 1, 10, 8, 2, 7, 7, 2],
                [9, 1, 8, 8, 2, 7, 8, 8],
                [1, 1, 8, 2, 7, 7, 8, 2]
            ],
            "5": [
                [2, 2, 2, 1, 1, 1, 1, 1],
                [2, 2, 2, 4, 1, 1, 1, 1],
                [8, 7, 1, 4, 9, 9, 1, 1],
                [8, 7, 7, 4, 4, 9, 9, 7],
                [7, 7, 8, 6, 4, 7, 9, 9],
                [7, 8, 8, 6, 4, 7, 7, 7],
                [3, 8, 6, 6, 10, 3, 7, 3],
                [3, 3, 3, 3, 10, 3, 4, 3],
                [3, 1, 3, 6, 10, 10, 4, 1],
                [1, 1, 3, 6, 4, 10, 5, 1],
                [1, 6, 5, 4, 4, 10, 5, 5],
                [6, 5, 5, 4, 1, 1, 1, 1],
                [6, 6, 7, 5, 1, 5, 5, 5],
                [5, 6, 7, 5, 1, 7, 7, 7],
                [6, 7, 7, 7, 7, 7, 7, 7]
            ],
            "6": [
                [5, 5, 5, 2, 8, 8, 0, 0],
                [5, 5, 5, 2, 8, 8, 7, 8],
                [7, 7, 7, 7, 4, 4, 7, 8],
                [7, 1, 6, 7, 4, 4, 3, 4],
                [6, 1, 6, 2, 7, 3, 7, 4],
                [6, 1, 6, 2, 1, 7, 3, 3],
                [6, 1, 1, 2, 2, 7, 3, 3]
            ],
            "7": [
                [1, 1, 1, 0, 3, 0, 6, 6],
                [4, 4, 8, 4, 3, 2, 2, 6],
                [4, 4, 8, 4, 7, 5, 2, 2],
                [1, 8, 3, 3, 7, 5, 2, 2],
                [1, 8, 8, 3, 7, 5, 5, 6],
                [1, 1, 8, 3, 7, 7, 5, 6],
                [5, 1, 1, 2, 8, 2, 5, 6],
                [5, 5, 5, 2, 7, 2, 4, 4],
                [5, 1, 5, 2, 8, 2, 4, 4],
                [1, 1, 8, 8, 8, 8, 4, 4]
            ],
            "8": [
                [4, 7, 7, 7, 2, 5, 7, 7],
                [4, 7, 7, 7, 2, 5, 7, 7],
                [4, 4, 4, 7, 2, 2, 2, 7],
                [2, 2, 4, 6, 2, 2, 2, 5],
                [2, 2, 6, 6, 6, 6, 5, 2],
                [5, 5, 6, 2, 3, 5, 5, 2],
                [5, 5, 6, 2, 3, 5, 3, 2],
                [6, 6, 6, 2, 3, 5, 3, 3],
                [6, 6, 2, 3, 3, 4, 4, 3],
                [1, 2, 2, 3, 3, 4, 4, 1],
                [1, 2, 2, 3, 1, 4, 4, 1],
                [1, 2, 1, 1, 1, 1, 1, 1]
            ],
            "9": [
                [6, 8, 8, 6, 4, 8, 8, 8],
                [6, 8, 8, 6, 4, 8, 8, 8],
                [6, 7, 7, 6, 4, 8, 1, 8],
                [7, 7, 7, 6, 1, 1, 1, 1],
                [7, 4, 6, 4, 1, 1, 1, 1],
                [4, 4, 6, 4, 1, 1, 1, 1],
                [6, 6, 6, 2, 7, 7, 1, 1],
                [3, 1, 3, 2, 7, 7, 7, 5],
                [3, 1, 3, 2, 4, 4, 7, 5],
                [2, 2, 3, 2, 2, 4, 4, 5],
                [2, 2, 3, 5, 1, 1, 1, 5],
                [2, 2, 2, 5, 1, 1, 1, 1]
            ],
            "10": [
                [1, 0, 0, 0, 0, 0, 0, 8],
                [1, 1, 1, 9, 9, 9, 8, 8],
                [9, 9, 1, 9, 9, 9, 8, 8],
                [9, 9, 1, 9, 2, 1, 7, 7],
                [8, 9, 6, 6, 2, 1, 1, 8],
                [8, 8, 6, 6, 2, 1, 7, 4],
                [1, 5, 6, 6, 8, 7, 7, 4],
                [1, 5, 2, 2, 8, 7, 4, 4],
                [5, 5, 2, 2, 8, 3, 4, 2],
                [5, 1, 4, 1, 2, 3, 4, 2],
                [5, 1, 4, 1, 2, 3, 1, 1],
                [2, 1, 1, 1, 2, 2, 1, 1],
                [2, 3, 4, 1, 5, 2, 3, 3],
                [3, 3, 4, 5, 5, 5, 2, 3],
                [3, 4, 4, 5, 3, 5, 3, 2]
            ],
            "11": [
                [0, 0, 0, 1, 0, 0, 0, 1],
                [1, 8, 7, 7, 7, 8, 8, 8],
                [1, 8, 7, 1, 7, 8, 6, 1],
                [1, 1, 7, 1, 6, 6, 3, 1],
                [5, 5, 1, 5, 6, 1, 3, 1],
                [2, 5, 1, 5, 1, 1, 6, 2],
                [2, 1, 1, 5, 1, 1, 6, 2],
                [2, 4, 4, 4, 1, 3, 3, 4],
                [2, 1, 1, 1, 4, 3, 3, 4]
            ],
            "12": [
                [3, 3, 3, 0, 0, 6, 6, 6],
                [3, 2, 3, 3, 7, 5, 5, 6],
                [2, 2, 2, 7, 7, 5, 5, 1],
                [2, 2, 6, 7, 4, 7, 5, 1],
                [5, 5, 6, 7, 4, 4, 5, 1],
                [5, 5, 6, 3, 3, 4, 4, 1],
                [6, 6, 6, 3, 3, 4, 5, 6],
                [2, 2, 3, 3, 1, 3, 5, 6],
                [2, 2, 3, 1, 1, 3, 3, 1],
                [1, 2, 1, 1, 2, 3, 3, 1]

            ],
            "13": [
                [3, 6, 6, 4, 4, 6, 0, 0],
                [3, 6, 6, 4, 4, 6, 6, 6],
                [3, 3, 3, 3, 4, 6, 5, 6],
                [3, 4, 2, 3, 4, 6, 5, 6],
                [4, 4, 2, 2, 1, 3, 5, 5],
                [4, 4, 1, 2, 1, 3, 5, 5],
                [4, 1, 1, 2, 2, 3, 3, 1]
            ],
            "14": [
                [0, 3, 0, 0, 0, 3, 0, 0],
                [3, 3, 8, 8, 3, 8, 8, 8],
                [1, 1, 6, 6, 7, 8, 7, 7],
                [5, 1, 6, 6, 7, 3, 7, 7],
                [5, 1, 6, 6, 3, 3, 3, 4],
                [5, 5, 1, 3, 2, 3, 2, 4],
                [5, 5, 1, 3, 2, 3, 4, 4],
                [1, 1, 1, 3, 2, 2, 3, 3],
                [1, 1, 1, 4, 2, 4, 3, 3]
            ],
            "15": [
                [6, 9, 8, 7, 7, 9, 8, 8],
                [6, 9, 8, 6, 7, 7, 8, 9],
                [1, 9, 2, 6, 5, 2, 8, 9],
                [1, 6, 2, 7, 5, 2, 6, 6],
                [6, 6, 2, 7, 5, 2, 6, 6],
                [6, 1, 5, 5, 2, 4, 4, 4],
                [1, 1, 5, 2, 4, 4, 4, 1],
                [1, 3, 3, 1, 2, 2, 3, 1],
                [1, 3, 3, 1, 2, 2, 3, 1]
            ],
            "16": [
                [6, 3, 6, 3, 3, 3, 0, 0],
                [6, 3, 6, 4, 4, 5, 6, 6],
                [2, 3, 2, 4, 4, 5, 5, 5],
                [3, 2, 3, 4, 4, 3, 3, 5],
                [1, 2, 3, 2, 2, 2, 3, 5],
                [1, 2, 1, 1, 2, 3, 3, 3],
                [1, 2, 1, 2, 2, 3, 3, 3]
            ],
            "17": [
                [7, 0, 0, 3, 5, 5, 5, 5],
                [7, 7, 7, 3, 4, 3, 5, 5],
                [7, 7, 3, 3, 4, 3, 6, 6],
                [2, 5, 5, 2, 4, 6, 6, 3],
                [2, 5, 5, 2, 1, 6, 3, 3],
                [1, 5, 2, 2, 1, 1, 4, 6],
                [1, 5, 3, 3, 1, 4, 4, 3]
            ],
            "18": [
                [3, 3, 6, 6, 6, 3, 3, 3],
                [3, 6, 6, 6, 8, 8, 3, 3],
                [8, 3, 3, 3, 8, 8, 3, 6],
                [8, 8, 7, 3, 3, 3, 6, 6],
                [8, 8, 7, 3, 8, 8, 6, 6],
                [3, 8, 7, 7, 7, 3, 6, 3],
                [3, 4, 7, 3, 5, 5, 3, 3],
                [4, 4, 4, 3, 5, 3, 3, 5],
                [2, 3, 4, 5, 5, 3, 3, 4],
                [2, 3, 4, 1, 3, 3, 4, 4],
                [3, 1, 3, 1, 2, 2, 4, 4],
                [1, 1, 1, 3, 3, 2, 2, 4]
            ],
            "19": [
                [5, 6, 6, 6, 1, 1, 5, 1],
                [5, 5, 4, 6, 1, 1, 5, 2],
                [6, 5, 4, 3, 3, 3, 2, 2],
                [6, 4, 1, 4, 3, 1, 1, 1],
                [4, 1, 1, 4, 1, 1, 2, 2],
                [1, 1, 1, 3, 3, 1, 2, 1],
                [2, 2, 1, 3, 3, 1, 1, 1],
                [1, 3, 1, 1, 1, 1, 3, 1],
                [1, 3, 2, 2, 2, 2, 3, 1]
            ],
            "20": [
                [8, 1, 8, 9, 9, 10, 1, 1],
                [8, 1, 9, 9, 10, 10, 1, 10],
                [7, 1, 8, 9, 10, 10, 10, 10],
                [7, 8, 8, 9, 10, 10, 2, 10],
                [7, 1, 7, 6, 2, 2, 2, 6],
                [7, 1, 7, 6, 2, 2, 5, 6],
                [1, 6, 1, 6, 10, 6, 5, 5],
                [1, 6, 1, 6, 6, 6, 5, 5],
                [1, 2, 2, 6, 4, 10, 10, 3],
                [1, 2, 1, 1, 4, 10, 3, 3],
                [4, 2, 4, 1, 4, 10, 5, 3],
                [2, 2, 4, 1, 3, 10, 10, 3]
            ],
            "21": [
                [8, 3, 8, 3, 3, 3, 3, 8],
                [8, 3, 8, 3, 4, 3, 5, 8],
                [3, 3, 6, 6, 4, 5, 5, 5],
                [3, 1, 7, 6, 4, 5, 6, 5],
                [3, 1, 7, 7, 1, 1, 6, 4],
                [4, 1, 4, 7, 1, 1, 6, 4],
                [4, 1, 4, 7, 1, 3, 3, 4],
                [1, 4, 7, 2, 3, 1, 3, 2],
                [1, 4, 2, 2, 2, 3, 3, 2]
            ],
            "22": [
                [4, 4, 4, 1, 1, 6, 6, 6],
                [4, 4, 4, 2, 1, 6, 4, 6],
                [4, 3, 4, 2, 2, 2, 4, 6],
                [3, 3, 3, 3, 2, 4, 4, 1],
                [1, 3, 1, 3, 3, 3, 1, 1],
                [1, 1, 3, 1, 5, 3, 3, 1],
                [2, 2, 1, 1, 5, 1, 1, 1],
                [2, 5, 1, 5, 1, 1, 2, 2],
                [1, 5, 1, 5, 1, 2, 1, 2]
            ],
            "23": [
                [7, 0, 0, 2, 6, 6, 6, 7],
                [7, 7, 7, 2, 1, 1, 6, 7],
                [1, 1, 4, 2, 1, 5, 6, 6],
                [2, 1, 4, 2, 5, 5, 5, 4],
                [2, 1, 4, 2, 3, 5, 5, 4],
                [4, 3, 3, 3, 2, 2, 1, 3],
                [2, 1, 1, 1, 2, 2, 1, 3]
            ],
            "24": [
                [5, 1, 6, 6, 6, 1, 1, 1],
                [5, 1, 6, 6, 1, 5, 5, 1],
                [1, 5, 5, 6, 1, 5, 5, 1],
                [1, 3, 5, 5, 3, 4, 4, 1],
                [2, 3, 5, 5, 3, 3, 4, 2],
                [2, 3, 3, 3, 3, 4, 4, 1],
                [1, 1, 3, 1, 3, 4, 2, 1],
                [2, 1, 2, 3, 1, 2, 2, 2],
                [2, 1, 2, 1, 1, 1, 2, 1]
            ],
            "25": [
                [9, 9, 9, 8, 8, 9, 0, 0],
                [3, 9, 9, 8, 8, 8, 6, 6],
                [7, 3, 7, 6, 8, 6, 6, 6],
                [3, 3, 7, 6, 6, 6, 7, 9],
                [3, 4, 7, 6, 6, 9, 7, 9],
                [3, 4, 5, 5, 6, 2, 9, 9],
                [4, 4, 5, 5, 9, 2, 1, 9],
                [4, 5, 9, 9, 9, 2, 1, 4],
                [4, 5, 9, 9, 2, 2, 1, 4],
                [3, 3, 2, 2, 4, 4, 1, 1],
                [3, 3, 2, 2, 4, 9, 1, 4],
                [1, 1, 1, 2, 2, 9, 9, 9],
                [1, 1, 1, 3, 2, 9, 3, 9]
            ]
        }
        console.log("MapSystem.mapConfig", mapConfig,);

        let tmp = {};
        let len = Object.keys(mapConfig).length;
        for (let i = 0; i < len; i++) {
            const element = mapConfig[i];
            tmp[i] = {
                width: element[0].length,
                height: element.length,
                time: 600,
                data: element,
            }
        }
        MapSystem.mapConfig = tmp;
    }

    // 缓存获取单关数据
    public static getMapData(levelId: number): IMapData {
        console.log("Load level :", levelId);
        let mapId = levelId;
        if (mapId >= 25) {
            mapId = 25;
        }
        console.log("Load Map :", mapId);
        let mapData = MapSystem.mapConfig[mapId];
        console.log("Load Map :", mapData);

        // 计算tile实际大小
        let maxW = mapData.width;
        let maxH = mapData.height;
        this.tileScale = 1;
        MapSystem.tileWidth = MapSystem.maxTileWidth * this.tileScale;
        MapSystem.tileHeight = MapSystem.maxTileHeight * this.tileScale;
        // 地图中空的大小
        let entryNum = mapData.data.flat().filter((num: number) => num === 0).length;
        return {
            itemTotalNum: maxW * maxH - entryNum, // tile总数
            width: maxW, // 地图宽度
            height: maxH, // 地图高度
            time: mapData.time, // 游戏时间
            tileWidth: MapSystem.tileWidth, // tile宽度
            tileHeight: MapSystem.tileHeight, // tile高度
            data: mapData.data,
        };
    }

    // 获取引导关数据
    public static getGuidePassMapData(): IMapData {
        console.log("Load Guide");
        let mapData = {
            width: 8,
            height: 6,
            time: 600,
            data: [
                [0, 0, 0, 0, 0, 5, 5, 0],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [2, 3, 3, 5, 5, 3, 5, 4],
                [5, 5, 1, 1, 5, 2, 4, 5],
                [5, 5, 1, 1, 5, 2, 4, 4],
                [5, 5, 5, 1, 1, 2, 2, 4]
            ],
        }

        // 计算tile实际大小
        let maxW = mapData.width;
        let maxH = mapData.height;
        this.tileScale = 1;
        MapSystem.tileWidth = MapSystem.maxTileWidth * this.tileScale;
        MapSystem.tileHeight = MapSystem.maxTileHeight * this.tileScale;
        // 地图中空的大小
        let entryNum = mapData.data.flat().filter((num: number) => num === 0).length;
        return {
            itemTotalNum: maxW * maxH - entryNum, // tile总数
            width: maxW, // 地图宽度
            height: maxH, // 地图高度
            time: mapData.time, // 游戏时间
            tileWidth: MapSystem.tileWidth, // tile宽度
            tileHeight: MapSystem.tileHeight, // tile高度
            data: mapData.data,
        };
    }

    // 随机生成类型组
    public static randomTypes(num: number): number[] {
        let result = [];
        for (let i = 0; i < MapSystem.maxTileTypeCount; i++) {
            result.push(i);
        }
        result.sort(() => Math.random() - 0.5);
        return result.slice(0, num);
    }
}


