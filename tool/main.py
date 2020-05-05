#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Filename :   main.py
# @Date     :   19-7-20 下午12:46
# @Author   :   DebuggerX

import sys
import os
import xlrd
import json

reload(sys)
sys.setdefaultencoding('utf8')

questions = []
options = []


def to_int(string):
    try:
        int(string)
        return int(string)
    except ValueError:  # 报类型错误，说明不是整型的
        try:
            float(string)  # 用这个来验证，是不是浮点字符串
            return int(float(string))
        except ValueError:  # 如果报错，说明即不是浮点，也不是int字符串。   是一个真正的字符串
            return False


def stringfy(string):
    num = to_int(string)
    if num:
        string = '{}'.format(num)
    res = json.dumps(string, ensure_ascii=False)
    return "'%s'" % res[1:-1].replace("'", "''").replace('\\"', '"').replace('?', '？')


def add_question(row):
    question = {
        'id': int(row[0]),
        'tags': stringfy(unicode(row[3])),
        'content': stringfy(unicode(row[4])),
    }
    questions.append(question)
    for i in range(4):
        option = {
            'question_id': int(row[0]),
            'content': stringfy(unicode(row[6 + i])),
            'correct': int(row[5]) == i + 1
        }
        options.append(option)


def build_sql():
    sql_question = r'insert into questions ' \
                   r'(id, content, tags)' \
                   r' values '
    for q in questions:
        sql_question += r'(%d, %s, %s), ' % (
            q['id'],
            q['content'],
            q['tags'],
        )
    sql_question = sql_question[0: -2] + ';'

    sql_option = r'insert into options ' \
                 r'(question_id, content, correct)' \
                 r' values '
    for o in options:
        sql_option += r'(%d, %s, %s), ' % (
            o['question_id'],
            o['content'],
            o['correct'],
        )
    sql_option = sql_option[0: -2] + ';'
    return '\n\n'.join([sql_question, sql_option])


def generate(file_path):
    try:
        # 打开excel文件，获得workbook对象
        wb = xlrd.open_workbook(file_path)
        # 获得workbook对象中所有表的名字
        sn = wb.sheet_names()
        # print 'sheet names :' + stringfy(sn, encoding="UTF-8",)
        for name in sn:
            # 利用表名打开worksheet
            ws = wb.sheet_by_name(name)
            for current_row in range(ws.nrows - 1):
                # 获取表中每一行的内容
                row = ws.row_values(current_row + 1)
                if len(unicode(row[1])):
                    add_question(row)
    except xlrd.XLRDError, e:
        return 'xls解析出错: ' + e.message

    return build_sql()


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print '请指定xls文件'
    else:
        file_path = sys.argv[1]
        if not os.path.isfile(file_path):
            print '文件不存在'
        else:
            print generate(file_path)
