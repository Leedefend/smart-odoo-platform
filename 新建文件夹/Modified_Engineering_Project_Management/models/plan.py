from odoo import models, fields, api

class Plan(models.Model):
    _name = 'project.plan'
    _description = 'Project Plan'

    name = fields.Char(string="计划名称", required=True)
    project_id = fields.Many2one('project.project', string="项目", required=True)
    department_id = fields.Many2one('hr.department', string="部门")
    start_date = fields.Date(string="开始日期")
    end_date = fields.Date(string="结束日期")



