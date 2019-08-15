'use strict';
const mysql = require('../_core/mysql');
const model = {};

model.boards = async (isAuth) => {    
  const conn = await mysql.conn();
  const [boards] = await conn.query(`
    SELECT board_no AS no, title, blog.date_for_korea(created_at) AS date, 
    (SELECT 
    CONCAT('[', GROUP_CONCAT(JSON_OBJECT('no', bb.tag_no, 'name', bb.name)), ']') AS json
    FROM t_board_tags AS aa 
    INNER JOIN t_tags AS bb USING (tag_no) 
    WHERE board_no = a.board_no
    ORDER BY aa.board_tag_no) AS tags 
    FROM t_boards AS a
    WHERE a.is_enabled = 1 
    AND ((? = false AND is_public = 1) OR (? = true))
    ORDER BY board_no DESC
  `, [isAuth, isAuth]);       
  return boards.map(board => {
    board.tags = JSON.parse(board.tags);
    return board;
  });  
}

model.boardsByTagName = async (tagName, isAuth) => {    
  const conn = await mysql.conn();  
  const [boards] = await conn.query(`
    SELECT board_no AS no, title, blog.date_for_korea(created_at) AS date, 
    (SELECT 
    CONCAT('[', GROUP_CONCAT(JSON_OBJECT('no', bb.tag_no, 'name', bb.name)), ']') AS json
    FROM t_board_tags AS aa 
    INNER JOIN t_tags AS bb USING (tag_no) 
    WHERE board_no = a.board_no
    ORDER BY aa.board_tag_no) AS tags 
    FROM t_boards AS a
    WHERE board_no IN (SELECT board_no FROM t_board_tags WHERE tag_no = (SELECT tag_no FROM t_tags WHERE name = ?))
    AND a.is_enabled = 1
    AND ((? = false AND is_public = 1) OR (? = true))
    ORDER BY board_no DESC
  `, [tagName, isAuth, isAuth]);       
  return boards.map(board => {
    board.tags = JSON.parse(board.tags);
    return board;
  }); 
}

model.board = async (no, isAuth) => {    
  const conn = await mysql.conn();
  const [board] = await conn.query(`
    SELECT board_no AS no, title, blog.date_for_korea(created_at) AS date, contents,
    (SELECT 
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT('no', bb.tag_no, 'name', bb.name)), ']') AS json
      FROM t_board_tags AS aa 
      INNER JOIN t_tags AS bb USING (tag_no) 
      WHERE board_no = a.board_no
      ORDER BY aa.board_tag_no) AS tags  
    FROM t_boards AS a
    WHERE board_no = ?
    AND a.is_enabled = 1
    AND ((? = false AND is_public = 1) OR (? = true))
  `, [no, isAuth, isAuth]);    
  if (board.length === 0) {
    return null;
  }
  board[0].tags = JSON.parse(board[0].tags);  
  return board[0];
}

model.addBoard = async (title, contents, tags, isPublic) => {
  const conn = await mysql.conn();
  const [{insertId}] = await conn.query('INSERT INTO t_boards (title, contents, is_public) VALUES (?, ?, ?)', [title, contents, isPublic ? 1 : 0]);   
  for (let i = 0; i < tags.length; i++) {
    await conn.query('INSERT IGNORE INTO t_tags (name) VALUES (?)', [tags[i].name])
  }
  for (let i = 0; i < tags.length; i++) {
    const [tag] = await conn.query('SELECT tag_no AS tagNo FROM t_tags WHERE name = ?', [tags[i].name]);
    tags[i].tagNo = tag[0].tagNo;    
  }
  for (let i = 0; i < tags.length; i++) {
    await conn.query('INSERT IGNORE INTO t_board_tags (board_no, tag_no) VALUES (?, ?)', [insertId, tags[i].tagNo])
  }  
}

model.tagsByRecently = async () => {    
  const conn = await mysql.conn();
  const [tags] = await conn.query(`
    SELECT tag_no AS no, name FROM t_tags
    ORDER BY updated_at DESC
  `);       
  return tags;
}

model.tagsByBest = async () => {    
  const conn = await mysql.conn();
  const [tags] = await conn.query(`
    SELECT tag_no AS no, name FROM t_tags
    ORDER BY count DESC
  `);       
  return tags; 
}

module.exports = model;