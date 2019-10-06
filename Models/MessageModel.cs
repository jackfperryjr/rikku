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
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime CreateDate { get; set; }
        public virtual ApplicationUser MessageSender { get; set; }
    }
}