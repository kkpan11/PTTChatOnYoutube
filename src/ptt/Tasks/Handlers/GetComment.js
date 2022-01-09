import PostData from '../../MessagePosterData/PostData.js'
import RecieveData from '../../MessagePosterData/RecieveData.js'

const getComment = (content, commentResult) => {
  const commentData = {}
  commentData.type = commentResult[1]
  commentData.id = commentResult[2]
  commentData.content = content
  commentData.date = new Date(
    PostData.postTime.getFullYear(),
    commentResult[4] - 1,
    commentResult[5],
    commentResult[6],
    commentResult[7]
  )
  return commentData
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/)
  const startLine = +lineResult[1]
  const endLine = +lineResult[2]
  let targetLine = PostData.endline - startLine + 1
  if (startLine < 5 && PostData.haveNormalInsideTitle) targetLine += 1
  const checkedLine = []
  // console.log("==GetPush from " + targetline + "to " + (Ptt.screen.length - 1));
  // console.log("==(pttstartline, pttendline, startline, endline, targetline): (" + PTTPost.startline + ", " + PTTPost.endline + ", " + startline + ", " + endline + ", " + targetline + ")");
  for (let i = targetLine; i < this.screen.length; i++) {
    const line = this.screen[i]
    const commentResult = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(
      line
    )
    if (commentResult != null) {
      let content = commentResult[3]
      const reg = /\s+$/g
      content = content.replace(reg, '')
      const comment = getComment(content, commentResult)
      RecieveData.comments.push(comment)
      if (reportMode) checkedLine.push(i)
      if (reportMode) console.log('GetPush at line', i, content, line)
    } else if (reportMode) console.log('GetPush at line fail', i, line)
  }
  if (reportMode) {
    console.log('GetPush startline,', startLine,
      ', endline', PostData.endLine,
      ', targetline', targetLine,
      ', checkedline', checkedLine,
      ', haveNormalTitle', PostData.haveNormalInsideTitle)
  }
  // const percentresult = Ptt.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)
  PostData.startLine = startLine
  PostData.endLine = endLine
  return { pass: true, callback: () => { } }
}
