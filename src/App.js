import React from "react";
import $ from "jquery";
import axios from "axios";
import Alert from "./components/alert";
import DatePicker from 'react-date-picker';
import ModalFrame from "./components/modal";
let date = new Date;

const status = ["Новое", "В работе", "Завершено"];//0 1 2 3

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			alert: false,
			status: [1, 0, 0],
			defaultPage: 0,
			countPages: 0,
			countRows: 10,
			startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
			endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
			disabledPickerDate: true,
			requests: [],
			finder: "",
			modalOpened: false,
			modalId: -1,
			modalDateCreation: "",
			modalName: ""
		}
	}
	setDefaultPage(value) {
		this.setState({
			defaultPage: value
		}, () => {
			axios.post("http://83.220.175.94:3000/api/requests", {
				countRows: this.state.countRows,
				page: this.state.defaultPage,
				status: this.state.status
			}, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			}).then(res => {
				this.state.requests = [];
				res.data.forEach((el, i) => {
					this.state.requests.push({
						id: el.id,
						name: el.name,
						phone: el.phone,
						text: el.text,
						dateCreation: el.dateCreation,
						status: el.status,
						dateClosed: el.dateClosed,
						comment: el.comment
					})
				})
				this.setState({
					requests: this.state.requests
				});
			})
		})
	}
	setCountRows(value) {
		this.setState({
			requests: [],
			countRows: value,
			defaultPage: 0
		}, () => {
			let fd = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate());
			let sd = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate());
			axios.post("http://83.220.175.94:3000/api/pages", {
				countRows: this.state.countRows,
				status: this.state.status,
				dateFilter: !this.state.disabledPickerDate ? [
					fd, sd
				] : null,
				finder: this.state.finder.length > 0 ? this.state.finder : null
			}, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			})
				.then(res => {
					this.setState({
						countPages: res.data[0].countPages
					})
				});

			axios.post("http://83.220.175.94:3000/api/requests", {
				countRows: this.state.countRows,
				page: this.state.defaultPage,
				status: this.state.status,
				dateFilter: !this.state.disabledPickerDate ? [
					fd, sd
				] : null,
				finder: this.state.finder.length > 0 ? this.state.finder : null
			}, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			}).then(res => {
				res.data.forEach((el, i) => {
					this.state.requests.push({
						id: el.id,
						name: el.name,
						phone: el.phone,
						text: el.text,
						dateCreation: el.dateCreation,
						status: el.status,
						dateClosed: el.dateClosed,
						comment: el.comment
					})
				})
				this.setState({
					requests: this.state.requests
				});
			})
		})
	}
	componentDidMount() {
		axios.post("http://83.220.175.94:3000/api/pages", {
			countRows: this.state.countRows,
			status: this.state.status
		}, {
			headers: { 'Access-Control-Allow-Origin': '*' }
		})
			.then(res => {
				this.setState({
					countPages: res.data[0].countPages
				})
			})
		axios.post("http://83.220.175.94:3000/api/requests", {
			countRows: this.state.countRows,
			page: this.state.defaultPage,
			status: this.state.status
		}, {
			headers: { 'Access-Control-Allow-Origin': '*' }
		}).then(res => {
			res.data.forEach((el, i) => {
				this.state.requests.push({
					id: el.id,
					name: el.name,
					phone: el.phone,
					text: el.text,
					dateCreation: el.dateCreation,
					status: el.status,
					dateClosed: el.dateClosed,
					comment: el.comment
				})
			})
			this.setState({
				requests: this.state.requests
			});
		})
	}
	showModalFrame(i) {
		switch (i) {
			case -1:
				this.setState({
					modalOpened: false,
					modalId: "",
					modalDateCreation: "",
					modalDateClosed: "",
					modalName: "",
					modalPhone: "",
					modalStatus: "",
					modalText: "",
					modalComment: ""
				})
				break;
			default:
				console.log(this.state.requests[i].comment);
				this.setState({
					modalOpened: !this.state.modalOpened,
					modalId: this.state.requests[i].id,
					modalDateCreation: this.state.requests[i].dateCreation,
					modalDateClosed: this.state.requests[i].dateClosed,
					modalName: this.state.requests[i].name,
					modalPhone: this.state.requests[i].phone,
					modalStatus: this.state.requests[i].status,
					modalText: this.state.requests[i].text,
					modalComment: this.state.requests[i].comment
				})
				break;
		}
	}
	finishRequest(id, comment) {
		this.showModalFrame(-1);
		console.log(comment);
		axios.post("http://83.220.175.94:3000/api/finishrequest", {
			id: id,
			comment: comment
		}, {
			headers: { 'Access-Control-Allow-Origin': '*' }
		}).then(response => {
			if (response.data) {
				this.setCountRows(this.state.countRows);
				this.setState({
					alert: true
				}, () => {
					setTimeout(() => {
						this.setState({
							alert: false
						})
					}, 4000);
				})
			}
		});
	}	
	render() {
		let pages = new Array(parseInt(this.state.countPages)).fill({});
		return (
			<div className="App h-100 w-100" style={{
				position: "absolute",
				overflow: "hidden"
			}}>
				<Alert opened={this.state.alert} />
				<ModalFrame
					opened={this.state.modalOpened}
					modalId={this.state.modalId}
					dateCreation={this.state.modalDateCreation}
					dateClosed={this.state.modalDateClosed}
					name={this.state.modalName}
					phone={this.state.modalPhone}
					status={this.state.modalStatus}
					text={this.state.modalText}
					comment={this.state.modalComment}
					closeFrame={(e) => this.showModalFrame(e)}
					finishRequest={(e,q) => this.finishRequest(e,q)} />
				<div className="d-flex flex-row justify-content-center">
					<div className="d-flex flex-column" style={{
						width: "60vw",
						marginTop: "5vw",
						marginBottom: "10vw",
						paddingRight: "1vw"
						// backgroundColor: "#ACACAC66"
					}}>
						<div className="d-flex flex-row">
							<div class="dropdown">
								<span style={{
									marginRight: "0.5vw"
								}}>Количество отображаемых обращений:</span>
								<a class="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
									{this.state.countRows}
								</a>
								<ul class="dropdown-menu" aria-labelledby="dropdownMenuLink" style={{
									minWidth: "0"
								}}>
									<li><a class="dropdown-item" href="#" onClick={() => {
										this.setCountRows(10);
									}}>10</a></li>
									<li><a class="dropdown-item" href="#" onClick={() => {
										this.setCountRows(20);
									}}>20</a></li>
									<li><a class="dropdown-item" href="#" onClick={() => {
										this.setCountRows(50);
									}}>50</a></li>
								</ul>
							</div>
						</div>
						<div className="d-flex flex-row align-items-center mt-2">
							<span style={{
								marginRight: "0.5vw"
							}}>Статус:</span>
							{status.map((el, i) => (
								<button type="button" class={`btn me-2 ${this.state.status[i] ? "btn-success" : "btn-outline-success"}`} onClick={() => {
									this.state.status[i] = !this.state.status[i] ? 1 : 0;
									this.setState({
										status: this.state.status
									}, () => {
										this.setCountRows(this.state.countRows);
									})
								}}>{el}</button>
							))}
						</div>

						<div className="d-flex flex-row mt-2 align-items-center">
							<span>Фильтр по дате:</span>
							<input class="form-check-input ms-1 me-2 mt-0" type="checkbox" id="cbDateFilter" value="" aria-label="" onChange={(e) =>
								this.setState({
									disabledPickerDate: !e.target.checked
								}, () => {
									this.setCountRows(this.state.countRows);
								})
							} />
							<DatePicker
								className="customDatePicker"
								onChange={(e) => {
									let newDate = new Date(e);
									if (newDate.getTime() > this.state.endDate.getTime()) {
										return false;
									}
									this.setState({
										startDate: newDate
									}, () => {
										this.setCountRows(this.state.countRows);
									})
								}}
								value={this.state.startDate}
								format="d.M.y"
								clearIcon={null}
								disabled={this.state.disabledPickerDate}
							/>
							<DatePicker
								className="customDatePicker"
								style={{
									margin: "5vw"
								}}
								onChange={(e) => {
									let newDate = new Date(e);
									if (newDate.getTime() < this.state.startDate.getTime()) {
										return false;
									}
									this.setState({
										endDate: newDate
									}, () => {
										this.setCountRows(this.state.countRows);
									})
								}}
								format="d.M.y"
								value={this.state.endDate}
								clearIcon={null}
								disabled={this.state.disabledPickerDate}
							/>
						</div>
						<div className="d-flex flex-row align-items-center mt-2">
							<label for="finder" className="form-label mb-0 me-2" style={{
								textAlign: "left",
								fontSize: "0.8vw",
								whiteSpace: "nowrap"
							}}>Поиск:</label>
							<input type="text" className="form-control" id="finder" defaultValue={this.state.finder} onInput={(e) => {
								this.setState({
									finder: $("#finder").val()
								}, () => {
									this.setCountRows(this.state.countRows)
								});
							}} placeholder="Введите ID обращения или номер телефона" />
						</div>

						<table class="table table-hover" >
							<thead>
								<tr>
									<th scope="col">ID обращения</th>
									<th scope="col">Дата создания</th>
									<th scope="col">Фамилия Имя Отчество</th>
									<th scope="col">Номер телефона</th>
									<th scope="col">Статус</th>
									<th scope="col">Дата закрытия</th>
								</tr>
							</thead>
							<tbody>
								{this.state.requests.map((el, i) => (
									<tr onDoubleClick={() => this.showModalFrame(i)}>
										<th scope="row">{el.id}</th>
										<td>{el.dateCreation}</td>
										<td>{el.name}</td>
										<td>{el.phone}</td>
										<td>{status[el.status]}</td>
										<td>{el.dateClosed}</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="d-flex flex-row align-items-center justify-content-start">
							<nav className="mx-auto" aria-label="...">
								<ul class="pagination">
									{pages.map((el, i) =>
										<li class={`page-item ${this.state.defaultPage === i && 'active'}`} key={i} onClick={() => {
											this.setDefaultPage(i)
										}}><a class="page-link" href="#">{i + 1}</a></li>
									)}
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
