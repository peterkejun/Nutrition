import React from "react";
import './TrendGraph.css';

class TrendGraph extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.selected_x = 0;
        this.canvas_ref = React.createRef();
        this.wrapper_ref = React.createRef();
        this.data = [];
        for (let i = 1; i <= 30; i++) {
            this.data.push([i - 1, (5 * Math.sin(0.5 * i)) + 5]);
        }
        this.canvas_param = {
            width: 700,
            height: 300,
            leading_offset: 10,
            trailing_offset: 10,
            top_offset: 20,
            bottom_offset: 20,
            dx: 0,
            dy: 0,
            thumb_r_sm: 4,
            thumb_r_lg: 6,
            label_height: 20,
            label_offset: 10
        };
        this.handle_canvas_click = this.handle_canvas_click.bind(this);
    }

    componentDidMount() {
        const rect = this.wrapper_ref.current.getBoundingClientRect();
        this.canvas_param.width = rect.width;
        this.canvas_param.height = rect.height;
        this.update_canvas(true);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.user != null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user != null) {
            const rect = this.wrapper_ref.current.getBoundingClientRect();
            this.canvas_param.width = rect.width;
            this.canvas_param.height = rect.height;
            this.update_canvas(false);
        }
    }

    handle_canvas_click(e) {
        const x = e.clientX - this.canvas_ref.current.getBoundingClientRect().left - this.canvas_param.leading_offset;
        const y = e.clientY - this.canvas_ref.current.getBoundingClientRect().top - this.canvas_param.top_offset;
        let index = Math.floor(x / this.canvas_param.dx);
        if ((index + 1) * this.canvas_param.dx - x < x - index * this.canvas_param.dx) {
            index += 1;
        }
        const x_valid = Math.abs(index * this.canvas_param.dx - x) < this.canvas_param.thumb_r_sm;
        const y_valid = Math.abs(this.canvas_param.height - this.canvas_param.bottom_offset - this.canvas_param.top_offset
            - this.data[index][1] * this.canvas_param.dy - y) < this.canvas_param.thumb_r_sm;
        if (x_valid && y_valid) {
            this.selected_x = index;
            this.update_canvas();
        }
    }

    update_canvas(animated) {
        const width = this.canvas_param.width, height = this.canvas_param.height;
        const leading_offset = 10, trailing_offset = 10, top_offset = 20, bottom_offset = 20;
        const dx = (width - leading_offset - trailing_offset) / this.data.length;
        this.canvas_param.dx = dx;
        let min = this.data[0][1], max = this.data[0][1], point;
        for (point of this.data) {
            if (point[1] < min) min = point[1];
            else if (point[1] > max) max = point[1];
        }
        const dy = (height - top_offset - bottom_offset) / (max - min);
        this.canvas_param.dy = dy;
        const canvas = this.canvas_ref.current;
        let context = canvas.getContext('2d');
        const data = this.data;
        const canvas_param = this.canvas_param;
        const selected_x = this.selected_x;
        function update_canvas_util(progress) {
            //graph
            context.clearRect(0, 0, width, height);
            canvas.width = width * 2;
            canvas.height = height * 2;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            context.scale(2, 2);
            //graduation
            context.lineWidth = 2;
            let grd = context.createLinearGradient(0, 0, 0, height);
            grd.addColorStop(0, 'rgba(245,248,245,0.03)');
            grd.addColorStop(1, 'rgba(231,238,232,0.1)');
            context.strokeStyle = grd;
            context.beginPath();
            for (let i = 0; i < data.length; i++) {
                context.moveTo(leading_offset + i * dx, height);
                context.lineTo(leading_offset + i * dx, 0);
            }
            context.closePath();
            context.stroke();
            //graduation scale
            context.fillStyle = '#FFFFFF';
            context.textAlign = 'center';
            for (let i = 0; i < data.length; i += 5) {
                context.fillText((i + 1).toString(), leading_offset + i * dx, height);
            }
            //data curve
            context.strokeStyle = '#E5EEE8';
            grd = context.createLinearGradient(0, 0, 0, height);
            grd.addColorStop(0, 'rgba(231,238,232,0.3)');
            grd.addColorStop(1, 'rgba(231,238,232,0)');
            context.fillStyle = grd;
            context.beginPath();
            context.moveTo(leading_offset + data[0][0] * dx, height - bottom_offset - data[0][1] * dy * progress);
            let point_x;
            let point_y;
            for (let i = 1; i < data.length; i++) {
                point_x = leading_offset + data[i][0] * dx;
                point_y = height - bottom_offset - data[i][1] * dy * progress;
                context.lineTo(point_x, point_y);
                context.lineTo(point_x, point_y);
            }
            context.stroke();
            context.lineTo(leading_offset + data[data.length - 1][0] * dx, height);
            context.lineTo(leading_offset, height);
            context.lineTo(leading_offset + data[0][0] * dx, height - bottom_offset - data[0][1] * dy * progress);
            context.closePath();
            context.fill();
            //data points
            for (let i = 0; i < data.length; i++) {
                context.beginPath();
                point_x = leading_offset + data[i][0] * dx;
                point_y = height - bottom_offset - data[i][1] * dy * progress;
                if (selected_x === i) {
                    context.moveTo(point_x + canvas_param.thumb_r_lg, point_y);
                    context.fillStyle = '#4C8056';
                    context.strokeStyle = '#7DCE82';
                    context.arc(point_x, point_y, canvas_param.thumb_r_lg, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                    context.stroke();
                } else {
                    context.moveTo(point_x + canvas_param.thumb_r_sm, point_y);
                    context.fillStyle = '#E7EEE8';
                    context.arc(point_x, point_y, canvas_param.thumb_r_sm, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                }
            }
            //data labels
            const offset = canvas_param.label_offset;
            const corner_radius = canvas_param.label_height / 2;
            const label_width = 50;
            let roc = 0;
            if (selected_x !== 0) {
                const pre = data[selected_x - 1][1];
                roc = (data[selected_x][1] - pre) / Math.abs(pre) * 100;
            }
            const texts = [data[selected_x][1].toFixed(1) + ' Cal',
                            roc > 0 ? '+' + roc.toFixed(1) + '%' : roc.toFixed(1) + '%'];
            const colors = ['rgba(233,226,122,0.9)', 'rgba(94,209,121, 0.9)'];
            point_x = leading_offset + data[selected_x][0] * dx + canvas_param.thumb_r_lg + offset;
            point_y = height - bottom_offset - data[selected_x][1] * dy * progress;
            for (let i = 0; i < texts.length; i++) {
                context.beginPath();
                context.moveTo(point_x + corner_radius, point_y);
                context.arc(point_x + corner_radius, point_y, corner_radius, Math.PI * 0.5, Math.PI * 1.5);
                context.lineTo(point_x + label_width - 2 * corner_radius, point_y - corner_radius);
                context.arc(point_x + label_width - corner_radius, point_y, corner_radius, Math.PI * 1.5, Math.PI * 0.5);
                context.lineTo(point_x + corner_radius, point_y + corner_radius);
                context.closePath();
                context.fillStyle = colors[i];
                context.fill();
                context.fillStyle = '#26715F';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(texts[i], point_x + label_width / 2, point_y);
                point_y += canvas_param.label_height + 5;
            }
        }
        if (!animated) {
            update_canvas_util(1);
            return;
        }
        const requestAnimationFrame = window.requestAnimationFrame;
        let progress = 0;
        requestAnimationFrame(function animate_rise() {
            console.log('animate');
            update_canvas_util(Math.pow(progress - 1, 3) + 1);
            progress += 0.03;
            if (progress < 1) {
                requestAnimationFrame(animate_rise);
            }
        })
    }

    render() {
        return <div id={'trend-graph-container'}>
            <div className={'row'} id={'vert-axis-graph-row'}>
                <div className={'col-1'} id={'vert-axis-container'}>
                    <h1 id={'vert-axis-title'} >Calories</h1>
                </div>
                <div className={'col-11'} id={'graph-container'} ref={this.wrapper_ref}>
                    <div id={'graduation-wrapper'}>
                        <canvas id={'graph-canvas'} ref={this.canvas_ref} width={this.canvas_param.width * 2} height={this.canvas_param.height * 2} onClick={this.handle_canvas_click}/>
                        {/*<canvas id={'thumb-canvas'} ref={this.thumb_ref} style={{left: this.state.thumb_left, top: this.state.thumb_top}} width={12} height={12}*/}
                        {/*        onMouseDown={this.handle_mouse_down} onMouseUp={this.handle_mouse_up} onMouseMove={this.handle_mouse_move} />*/}
                    </div>
                </div>
            </div>
            <div className={'row'} id={'horiz-axis-row'}>
                <h1 className={'col-12'} id={'horiz-axis-title'}>January</h1>
            </div>
        </div>
    }

}

export default TrendGraph;