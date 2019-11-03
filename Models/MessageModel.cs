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
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy hh:mm}")]
        public DateTime CreateDate { get; set; }
        public virtual ApplicationUser MessageSender { get; set; }
        public int MessageReadFlg { get; set; } = 0;
        public string DeletedBy1 { get; set; }
        public string DeletedBy2 { get; set; }
    }
}