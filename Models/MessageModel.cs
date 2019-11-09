using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Rikku.Data;

namespace Rikku.Models
{
    public class MessageModel
    {          
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageId { get; set; }
        public string UserId { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime CreateDate { get; set; }
        public int MessageReadFlg { get; set; } = 0;
        public string DeletedBy1 { get; set; }
        public string DeletedBy2 { get; set; }
        public int IsLiked { get; set; }
        public int IsLoved { get; set; }
        public int IsDisliked { get; set; }
        public int IsSaddened { get; set; }
        public int IsLaughed { get; set; }
    }
}