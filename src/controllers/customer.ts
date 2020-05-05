import wrap from "../helpers/catchWrapper";
import { NextFunction, Request, Response } from "express";
import Customer from "../models/customer";
import jwt from "../helpers/jwtUtil";
import UnauthorizedApiError from "../errors/unauthorizedApiError";
import History from "../models/history";

export default class CustomerController {
  /**
   * @api {post} /customers/login 微信登录
   * @apiPermission none
   * @apiVersion 1.0.0
   * @apiName Customer.login
   * @apiGroup Customer
   *
   * @apiParam {String} unionId 微信 union ID
   * @apiParam {String} openId 微信 opend ID
   * @apiParam {String} avatar 微信头像Url
   * @apiParam {String} nickName 微信昵称
   *
   * @apiSuccess {string} token access_token
   * @apiSuccess {string} playCount 今日挑战次数
   * @apiSuccess {string} is_new 是否是第一次答题（基于分数判断）
   * @apiSuccessExample Success-Response:
   *     Status: 200 OK
   *     {
   *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2FwaS5teXlsLnp5c2MuY29tXC92MVwvcmVnaXN0ZXIiLCJpYXQiOjE0NzA3ODg0NDgsImV4cCI6MTQ3MDc5MjA0OCwibmJmIjoxNDcwNzg4NDQ4LCJqdGkiOiJmMWU5YmIwODRhYzk3ZDViMmE5ZTQxYTQxYTFmM2VlZiJ9.-3hHrtNcUq0nbNGIuIf8VZyhx8mEALLqVI0WyQtlMBI",
   *       "playCount": 1,
   *       "is_new": false,
   *     }
   */
  static login = wrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { unionId, openId, avatar, nickName } = req.context;
      let { customer } = req.context;

      if (!customer) {
        try {
          customer = await Customer.createCustomer(
            unionId,
            openId,
            avatar,
            nickName,
          );
        } catch (error) {
          throw new UnauthorizedApiError();
        }
      }
      res.json({
        token: jwt.sign(customer.get("id")),
        playCount: await History.countToday(customer.get("id")),
        is_new: !customer.get("score"),
      });
    }
  );

  /**
   * @api {get} /customers/play-count 今日已经挑战次数
   * @apiPermission none
   * @apiVersion 1.0.0
   * @apiName Customers.playCount
   * @apiGroup Customers
   *
   * @apiSuccess {playCount: number} playCount playCount
   * @apiSuccessExample Success-Response:
   *     Status: 200 OK
   *     {
   *       playCount: 2
   *     }
   */
  static playCount = wrap(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.json({
        playCount: await History.countToday(req.context.customer.id),
      });
    });


  /**
   * @api {get} /customers/ranking 排行榜
   * @apiPermission none
   * @apiVersion 1.0.0
   * @apiName Customers.ranking
   * @apiGroup Customers
   *
   * @apiSuccess {ranking: [{avatar: string, nick_name: string, rank: string, score: number}], me: {}} ranking ranking
   * @apiSuccessExample Success-Response:
   *     Status: 200 OK
   *     {
   *       ranking:
   *         [
   *           {
   *             avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/randomlies/128.jpg",
   *             nick_name: "withdrawal",
   *             rank: "1",
   *             score: 2929
   *           }
   *         ],
   *       me: {
   *         avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/xxxxx/128.jpg",
   *         nick_name: "xxxxx",
   *         rank: "9",
   *         score: 1999
   *       }
   *     }
   */
  static ranking = wrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const ranking: any[] = await Customer.getRanking(req.context.customer.id);
      let cIndex;
      for (let i = 0; i < ranking.length; i++) {
        if (ranking[i].id === req.context.customer.id) {
          cIndex = i;
        }
        delete ranking[i].id;
      }
      let me;
      if (cIndex === ranking.length - 1) {
        me = ranking.pop();
      } else {
        me = ranking[cIndex];
      }
      return res.json({
        ranking,
        me,
      });
    });
}
