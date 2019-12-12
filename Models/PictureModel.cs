using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace Rikku.Models
{
    public class PictureModel
    {          
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid PictureId { get; set; }
        public string UserId { get; set; }
        public string Path { get; set; }
    }
}